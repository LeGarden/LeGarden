// tslint:disable-next-line:no-implicit-dependencies
import onoff = require('onoff');
import { debug, error, info, warn } from 'winston';
import { ActorState, IActor } from './IActor';
import { IDeviceController } from './IDeviceController';

export class RaspyDeviceContoller implements IDeviceController {
  private actorId2Gpio: Map<string, any>;

  constructor() {
    this.actorId2Gpio = new Map([
      ['26', new onoff.Gpio(26, 'high')],
      ['4', new onoff.Gpio(4, 'high')],
      ['17', new onoff.Gpio(17, 'high')],
      ['27', new onoff.Gpio(27, 'high')],
      ['22', new onoff.Gpio(22, 'high')],
      ['5', new onoff.Gpio(5, 'high')],
      ['6', new onoff.Gpio(6, 'high')],
      ['13', new onoff.Gpio(13, 'high')],
    ]);
  }

  public turnActorOn(actor: IActor): void {
    actor.state = ActorState.On;

    const gpio = this.actorId2Gpio.get(actor.id);
    if (gpio) {
      gpio.writeSync(0);
    }

    info('Actor ' + actor.name + ' turned ' + actor.state);
  }

  public turnActorOff(actor: IActor): void {
    actor.state = ActorState.Off;

    const gpio = this.actorId2Gpio.get(actor.id);
    if (gpio) {
      gpio.writeSync(1);
    }
    // tslint:disable-next-line:no-console
    info('Actor ' + actor.name + ' turned ' + actor.state);
  }

  public turnAllActorOff(): void {
    this.actorId2Gpio.forEach((value: any, key: string) => {
      value.unexport();
    });
  }
}
