import { IActor } from '../Infrastructure/IActor';
import { INetworkConfiguration } from './INetworkConfiguration';
import { ITimedActorConfiguration } from './ITimedActorConfiguration';

export interface IConfiguration {
  checkCycleInterval: number;
  network: INetworkConfiguration;
  actors: { [index: string]: IActor };
  timedActorConfiguration: { [index: string]: ITimedActorConfiguration };
}
