import { DeviceMethodRequest, DeviceMethodResponse } from 'azure-iot-device';
import { CronJob } from 'cron';
import { ActorState, IActor } from '../Infrastructure/IActor';
import { IClientService } from '../Infrastructure/IClientService';
import { IDeviceController } from '../Infrastructure/IDeviceController';
import { ILogger } from '../Infrastructure/ILogger';
import { INetworkController } from '../Infrastructure/INetworkController';
import { ActorRepository } from './ActorRepository';
import { ConfigurationRepository } from './ConfigurationRepository';
import { IConfiguration } from './IConfiguration';
import { ITimedActorConfiguration } from './ITimedActorConfiguration';

export class LeGardenService {
  public clientConnectionState: boolean = false;
  public timedActorConfiguration: {
    [index: string]: ITimedActorConfiguration;
  } = {};

  private clientService: IClientService;
  private deviceController: IDeviceController;
  private networkController: INetworkController;
  private configRepo: ConfigurationRepository;
  private actorRepo: ActorRepository;
  private config: IConfiguration | undefined;
  private jobs: CronJob[] = [];

  constructor(
    private logger: ILogger,
    configRepo: ConfigurationRepository,
    actorRepo: ActorRepository,
    clientService: IClientService,
    deviceController: IDeviceController,
    networkController: INetworkController
  ) {
    this.clientService = clientService;
    this.deviceController = deviceController;
    this.networkController = networkController;
    this.configRepo = configRepo;
    this.actorRepo = actorRepo;
  }

  public async initialize(): Promise<any> {
    const ret = await this.networkController.connect();
    this.logger.debug('after network connect');

    await this.connectToIotHub();

    this.config = await this.configRepo.get();
    this.timedActorConfiguration = this.config.timedActorConfiguration;
    this.clientService.onDeviceMethod(
      'reconfigure',
      this.reconfigure.bind(this)
    );
    this.clientService.onDeviceMethod('getStatus', this.getStatus.bind(this));
    this.clientService.onDeviceMethod('act', this.act.bind(this));

    this.registerJobs();

    setInterval(() => {
      this.check();
    }, this.config.checkCycleInterval * 1000);
  }

  private async connectToIotHub() {
    if (this.clientConnectionState === false) {
      await this.clientService.connect().then(
        (connected: boolean) => {
          this.clientConnectionState = true;
        },
        (reason: string) => {
          if (this.config) {
            this.logger.warn(
              'could not connect to IotHub retry in ' +
                this.config.network.iotHubRetryTimeout +
                's.'
            );
            // not sure if really needed because of build in strategy https://github.com/Azure/azure-iot-sdk-node/wiki/Connectivity-and-Retries
            setTimeout(() => {
              this.connectToIotHub();
            }, this.config.network.iotHubRetryTimeout * 1000);
          } else {
            this.logger.warn('could not connect to IotHub.');
          }
        }
      );
    }
  }

  private async reconfigure(
    request: DeviceMethodRequest,
    response: DeviceMethodResponse
  ) {
    this.logger.info('reconfigure called.');

    this.deregisterJobs();
    this.config = await this.configRepo.get();
    this.timedActorConfiguration = this.config.timedActorConfiguration;
    this.registerJobs();

    this.logger.info('reconfigure called successfully.');
    response.send(200, 'reconfigure called successfully.', err => {
      if (err) {
        this.logger.error(
          'An error ocurred when sending a method response:\n' + err.toString()
        );
      } else {
        this.logger.debug(
          "Response to method '" + request.methodName + "' sent successfully."
        );
      }
    });
  }

  private async getStatus(
    request: DeviceMethodRequest,
    response: DeviceMethodResponse
  ) {
    this.logger.info('getStatus called.');

    const payload: any[] = [];

    this.actorRepo.getAll().forEach((actor: IActor) => {
      payload.push({
        id: actor.id,
        name: actor.name,
        state: actor.state,
      });
    });

    this.logger.info('getStatus called successfully.');
    response.send(200, payload, err => {
      if (err) {
        this.logger.error(
          'An error ocurred when sending a method response:\n' + err.toString()
        );
      } else {
        this.logger.debug(
          "Response to method '" + request.methodName + "' sent successfully."
        );
      }
    });
  }

  private async act(
    request: DeviceMethodRequest,
    response: DeviceMethodResponse
  ) {
    this.logger.info('act called with: ' + request.payload);

    const actor = this.actorRepo.get(request.payload.id);
    if (actor) {
      switch (request.payload.state) {
        case 0:
          this.deviceController.turnActorOff(actor);
          break;
        case 1:
          this.deviceController.turnActorOn(actor);
          break;
        default:
          response.send(403, 'state allows the values 0 and 1.');
          break;
      }
    } else {
      response.send(404, 'actor with id ' + request.payload.id + 'not found.');
    }

    this.logger.info('act called successfully.');

    response.send(200, this.actorRepo.clone(actor), err => {
      if (err) {
        this.logger.error(
          'An error ocurred when sending a method response:\n' + err.toString()
        );
      } else {
        this.logger.debug(
          "Response to method '" + request.methodName + "' sent successfully."
        );
      }
    });
  }

  private registerJobs() {
    for (const key in this.timedActorConfiguration) {
      if (key) {
        const tac: ITimedActorConfiguration = this.timedActorConfiguration[key];

        this.logger.info(
          'configuring job for actorid ' +
            tac.actorId +
            ' cron ' +
            tac.cron +
            ' in state ' +
            tac.cronActive
        );
        const job = new CronJob(
          tac.cron,
          () => {
            const actor = this.actorRepo.get(tac.actorId);
            if (actor) {
              this.deviceController.turnActorOn(actor);
              setTimeout(() => {
                this.deviceController.turnActorOff(actor);
              }, tac.duration * 1000);
            } else {
              this.logger.warn(
                'actor with id ' + tac.actorId + ' could not be found.'
              );
            }
          },
          () => {
            const actor = this.actorRepo.get(tac.actorId);
            if (actor) {
              this.deviceController.turnActorOff(actor);
            }
          },
          tac.cronActive,
          'Europe/Berlin'
        );

        this.jobs.push(job);
      }
    }
  }

  private deregisterJobs() {
    this.deviceController.turnAllActorsOff();
    this.jobs.forEach((j: CronJob) => {
      j.stop();
    });
    this.jobs = [];
  }

  private check(): void {
    // Check if connected to Internet and if not reconnect to internet and IotHub
    this.networkController.connected().then((value: boolean) => {
      if (value !== true) {
        this.networkController.connect();
        this.networkController.connected().then((value2: boolean) => {
          if (value2 === true) {
            this.logger.info('reconnected to internet');
            this.clientService.connect().then((value3:boolean) => {
              this.logger.info('reconnected to iothub');
            });
          }
        });
      }
    });
  }
}
