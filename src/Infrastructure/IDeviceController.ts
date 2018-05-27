import { IActor } from './IActor';

export interface IDeviceController {
  turnActorOn(actor: IActor): void;
  turnActorOff(actor: IActor): void;
  turnAllActorsOff(): void;
}
