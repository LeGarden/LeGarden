import { debug, error, info, warn } from 'winston';
import { ActorState, IActor } from './IActor';
import { IDeviceController } from './IDeviceController';

export class MockDeviceController implements IDeviceController {
  public turnActorOn(actor: IActor): void {
    actor.state = ActorState.On;
    actor.onCallback = setTimeout(() => {
      if (actor.state === ActorState.On) {
        this.turnActorOff(actor);
        warn('turned off actor after longrun.');
      }
    }, 3600000);
    info('Actor ' + actor.name + ' turned ' + actor.state);
  }

  public turnActorOff(actor: IActor): void {
    actor.state = ActorState.Off;
    clearTimeout(actor.onCallback);
    info('Actor ' + actor.name + ' turned ' + actor.state);
  }

  public turnAllActorsOff(): void {
    info('Unexporting Mock GPIOs');
  }
}
