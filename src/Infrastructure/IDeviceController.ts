import { IActor } from './IActor';

export interface IDeviceController {
  turnActorOn(actor: IActor): boolean;
  turnActorOff(actor: IActor): boolean;
  turnAllActorsOff(): boolean;
}
