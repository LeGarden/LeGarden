import { schedule } from 'node-cron';
import { debug, error, info, warn } from 'winston';
import { ActorState, IActor } from '../Infrastructure/IActor';
import { IClientService } from '../Infrastructure/IClientService';
import { IDeviceController } from '../Infrastructure/IDeviceController';
import { INetworkController } from '../Infrastructure/INetworkController';
import { ActorRepository } from './ActorRepository';
import { IConfiguration } from './IConfiguration';
import { ITimedActorConfiguration } from './ITimedActorConfiguration';

export class LeGardenService {
  public clientConnectionState: boolean = false;
  public timedActorConfiguration: ITimedActorConfiguration[] = [];

  private clientService: IClientService;
  private deviceController: IDeviceController;
  private networkController: INetworkController;
  private config: IConfiguration;
  private actorRepo: ActorRepository;

  constructor(
    config: IConfiguration,
    actorRepo: ActorRepository,
    clientService: IClientService,
    deviceController: IDeviceController,
    networkController: INetworkController
  ) {
    this.clientService = clientService;
    this.deviceController = deviceController;
    this.networkController = networkController;
    this.config = config;
    this.timedActorConfiguration = config.timedActorConfiguration;
    this.actorRepo = actorRepo;
  }

  public async initialize(): Promise<any> {
    const ret = await this.networkController.connect();
    debug('after network connect');

    this.clientService.connect();

    this.clientService.connectionState.subscribe((val: boolean) => {
      this.clientConnectionState = val;
      info('cloudConnectionState: ' + this.clientConnectionState);
    });

    this.timedActorConfiguration.forEach((tac: ITimedActorConfiguration) => {
      schedule(tac.cron, () => {
        const actor = this.actorRepo.get(tac.actorId);
        if (actor) {
          this.deviceController.turnActorOn(actor);
          setTimeout(() => {
            this.deviceController.turnActorOff(actor);
          }, tac.duration * 1000);
        }
      });
    });

    const sendInterval = setInterval(() => {
      this.check();
    }, this.config.checkCycleInterval * 1000);
  }

  private check(): void {
    if (this.clientConnectionState === true) {
      //   this.clientService.sendEvent(data);
      debug('IoTConnectionState: ' + this.clientConnectionState);
    }
  }
}
