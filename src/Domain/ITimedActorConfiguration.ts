import { IActor } from '../Infrastructure/IActor';

export interface ITimedActorConfiguration {
  actorId: string;
  cron: string;
  duration: number;
  weatherAware: boolean;
}
