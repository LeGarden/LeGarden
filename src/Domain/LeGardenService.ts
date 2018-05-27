import { CronJob } from 'cron';
import { debug, error, info, warn } from 'winston';
import { ActorState, IActor } from '../Infrastructure/IActor';
import { IClientService } from '../Infrastructure/IClientService';
import { IDeviceController } from '../Infrastructure/IDeviceController';
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
    debug('after network connect');

    if (this.clientConnectionState === false) {
      await this.clientService.connect();
    }

    this.config = await this.configRepo.get();
    this.timedActorConfiguration = this.config.timedActorConfiguration;

    this.registerJobs();

    const sendInterval = setInterval(() => {
      this.check();
    }, this.config.checkCycleInterval * 1000);
  }

  private registerJobs() {
    for (const key in this.timedActorConfiguration) {
      if (key) {
        const tac: ITimedActorConfiguration = this.timedActorConfiguration[key];
        const actor = this.actorRepo.get(tac.actorId);
        info(
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
            if (actor) {
              this.deviceController.turnActorOn(actor);
              setTimeout(() => {
                this.deviceController.turnActorOff(actor);
              }, tac.duration * 1000);
            } else {
              warn('actor with id ' + tac.actorId + ' could not be found.');
            }
          },
          () => {
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
    this.deviceController.turnAllActorOff();
    this.jobs.forEach((j: CronJob) => {
      j.stop();
    });
    this.jobs = [];
  }

  private check(): void {
    // tslint:disable-next-line:no-empty
    if (this.clientConnectionState === true) {
    }
  }
}
