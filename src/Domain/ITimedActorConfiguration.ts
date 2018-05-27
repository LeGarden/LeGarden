import { IActor } from '../Infrastructure/IActor';

export interface ITimedActorConfiguration {
  actorId: string;
  cron: string;
  cronActive: boolean;
  duration: number;
  weatherAware: boolean;
}
