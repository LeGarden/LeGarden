import { ActorState, IActor } from './IActor';
import { IDeviceController } from './IDeviceController';

export class MockDeviceController implements IDeviceController {
  public turnActorOn(actor: IActor): void {
    actor.state = ActorState.On;
    // tslint:disable-next-line:no-console
    console.log('Actor ' + actor.name + ' turned ' + actor.state);
  }

  public turnActorOff(actor: IActor): void {
    actor.state = ActorState.Off;
    // tslint:disable-next-line:no-console
    console.log('Actor ' + actor.name + ' turned ' + actor.state);
  }

  public unexport(): void {
    // tslint:disable-next-line:no-console
    console.log('Unexporting Mock GPIOs');
  }
}
