import { IActor } from '../Infrastructure/IActor';

export interface ITimedActorConfiguration {
  actor?: IActor;
  cron: string;
  duration: number;
}
