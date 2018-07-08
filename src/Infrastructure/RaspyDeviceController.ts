// tslint:disable-next-line:no-implicit-dependencies
import onoff = require('onoff');
import { ActorState, IActor } from './IActor';
import { IDeviceController } from './IDeviceController';
import { ILogger } from './ILogger';

export class RaspyDeviceContoller implements IDeviceController {
  private actorId2Gpio: Map<string, any>;

  constructor(private logger: ILogger) {
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

      // safety fallback
      actor.onCallback = setTimeout(() => {
        if (actor.state === ActorState.On) {
          this.turnActorOff(actor);
          this.logger.warn('turned off actor after longrun.');
        }
      }, 3600000);
      this.logger.info('Actor ' + actor.name + ' turned ' + actor.state);
    } else {
      this.logger.warn('no gpio found with id ' + actor.id);
    }
  }

  public turnActorOff(actor: IActor): void {
    actor.state = ActorState.Off;
    if (actor.onCallback) {
      clearTimeout(actor.onCallback);
    }

    const gpio = this.actorId2Gpio.get(actor.id);
    if (gpio) {
      gpio.writeSync(1);
      this.logger.info('Actor ' + actor.name + ' turned ' + actor.state);
    } else {
      this.logger.warn('no gpio found with id ' + actor.id);
    }
  }

  public turnAllActorsOff(): void {
    this.actorId2Gpio.forEach((value: any, key: string) => {
      value.unexport();
    });
  }
}
