import { ActorState, IActor } from '../Infrastructure/IActor';
import { IClientService } from '../Infrastructure/IClientService';
import { IDeviceController } from '../Infrastructure/IDeviceController';
import { ActorRepository } from './ActorRepository';
import { IConfiguration } from './IConfiguration';
import { ITimedActorConfiguration } from './ITimedActorConfiguration';

export class LeGardenService {
  public clientConnectionState: boolean = false;
  public timedActorConfiguration: ITimedActorConfiguration[] = [];

  private clientService: IClientService;
  private deviceController: IDeviceController;
  private config: IConfiguration;
  private actorRepo: ActorRepository;
 

  constructor(
    config: IConfiguration,
    actorRepo: ActorRepository,
    clientService: IClientService,
    deviceController: IDeviceController
  ) {
    this.clientService = clientService;
    this.deviceController = deviceController;
    this.config = config;
    this.timedActorConfiguration = config.timedActorConfiguration;
    this.actorRepo = actorRepo;
  }

  public initialize(): void {
    this.clientService.connect();

    this.clientService.connectionState.subscribe((val: boolean) => {
      this.clientConnectionState = val;
      // tslint:disable-next-line:no-console
      console.log('clientConnectionState: ' + this.clientConnectionState);
    });

    const sendInterval = setInterval(() => {
      this.check();
    }, this.config.checkCycleInterval);
  }

  private check(): void {

    this.timedActorConfiguration.forEach((tac: ITimedActorConfiguration) => {
        const currentDate = new Date();
        const actor = this.actorRepo.get(tac.actor.id);

        if(actor) {
            if (tac.from.getHours() > currentDate.getHours() && tac.from.getMinutes() > currentDate.getMinutes() && tac.to.getHours() < currentDate.getHours() && tac.to.getMinutes() < currentDate.getMinutes()) {
                // should be On
                if(actor.state === ActorState.Off) {
                    this.deviceController.turnActorOn(actor);
                }
            } else {
                // should be Off
                if(actor.state === ActorState.On) {
                    this.deviceController.turnActorOff(actor);
                }
            }
        }
    });

    if (this.clientConnectionState === true) {
    //   this.clientService.sendEvent(data);
    }
  }
}
