import { IActor } from '../Infrastructure/IActor';

export interface ITimedActorConfiguration {
  actor: IActor;
  from: Date;
  to: Date;
}
