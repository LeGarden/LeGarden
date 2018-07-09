import { ActorState, IActor } from './IActor';
import { IClientService } from './IClientService';
import { IDeviceController } from './IDeviceController';
import { ILogger } from './ILogger';

export class MockDeviceController implements IDeviceController {
  constructor(private logger: ILogger) {}

  public turnActorOn(actor: IActor): boolean {
    actor.state = ActorState.On;
    actor.onCallback = setTimeout(() => {
      if (actor.state === ActorState.On) {
        this.turnActorOff(actor);
        this.logger.warn('turned off actor after longrun.');
      }
    }, 3600000);

    this.logger.info('Actor ' + actor.name + ' turned ' + actor.state);
    return true;
  }

  public turnActorOff(actor: IActor): boolean {
    actor.state = ActorState.Off;
    if (actor.onCallback) {
      clearTimeout(actor.onCallback);
    }

    this.logger.info('Actor ' + actor.name + ' turned ' + actor.state);
    return true;
  }

  public turnAllActorsOff(): boolean {
    this.logger.info('Unexporting Mock GPIOs');
    return true;
  }
}
