import { debug, error, info, warn } from 'winston';
import { ActorState, IActor } from './IActor';
import { IDeviceController } from './IDeviceController';

export class MockDeviceController implements IDeviceController {
  public turnActorOn(actor: IActor): void {
    actor.state = ActorState.On;
    info('Actor ' + actor.name + ' turned ' + actor.state);
  }

  public turnActorOff(actor: IActor): void {
    actor.state = ActorState.Off;
    info('Actor ' + actor.name + ' turned ' + actor.state);
  }

  public turnAllActorOff(): void {
    info('Unexporting Mock GPIOs');
  }
}
