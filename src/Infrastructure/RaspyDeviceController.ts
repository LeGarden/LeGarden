// tslint:disable-next-line:no-implicit-dependencies
import onoff = require('onoff');
import { ActorState, IActor } from './IActor';
import { IDeviceController } from './IDeviceController';

export class RaspyDeviceContoller implements IDeviceController {
  private actorId2Gpio: Map<string, onoff.Gpio>;

  constructor() {
    this.actorId2Gpio = new Map([
      ['19', new onoff.Gpio(26, 'high')],
      ['20', new onoff.Gpio(19, 'high')],
      ['21', new onoff.Gpio(20, 'high')],
      ['26', new onoff.Gpio(21, 'high')],
    ]);
  }

  public turnActorOn(actor: IActor): void {
    actor.state = ActorState.On;

    const gpio = this.actorId2Gpio.get(actor.id);
    if (gpio) {
      gpio.writeSync(0);
    }

    // tslint:disable-next-line:no-console
    console.log('actor ' + actor.id + ' turned ' + actor.state);
  }

  public turnActorOff(actor: IActor): void {
    actor.state = ActorState.Off;

    const gpio = this.actorId2Gpio.get(actor.id);
    if (gpio) {
      gpio.writeSync(1);
    }
    // tslint:disable-next-line:no-console
    console.log('actor ' + actor.id + ' turned ' + actor.state);
  }

  public unexport(): void {
    this.actorId2Gpio.forEach(gpio => {
      gpio.unexport();
    });
  }
}
