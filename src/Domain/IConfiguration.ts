import { IActor } from '../Infrastructure/IActor';
import { INetworkConfiguration } from './INetworkConfiguration';
import { ITimedActorConfiguration } from './ITimedActorConfiguration';

export interface IConfiguration {
  /**
   * Configures in what period should the checkcycle be performed in seconds.
   *
   * @type {number}
   * @memberof IConfiguration
   */
  checkCycleInterval: number;
  network: INetworkConfiguration;
  actors: { [index: string]: IActor };
  timedActorConfiguration: { [index: string]: ITimedActorConfiguration };
}
