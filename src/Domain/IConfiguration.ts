import { IActor } from '../Infrastructure/IActor';
import { INetworkConfiguration } from './INetworkConfiguration';
import { ITimedActorConfiguration } from './ITimedActorConfiguration';

export interface IConfiguration {
  checkCycleInterval: number;
  network: INetworkConfiguration;
  actors: IActor[];
  timedActorConfiguration: ITimedActorConfiguration[];
}
