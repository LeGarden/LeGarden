import { IActor } from "../Infrastructure/IActor";
import { ITimedActorConfiguration } from "./ITimedActorConfiguration";

export interface IConfiguration {
  checkCycleInterval: number;
  actors: IActor[];
  timedActorConfiguration: ITimedActorConfiguration[];
}
