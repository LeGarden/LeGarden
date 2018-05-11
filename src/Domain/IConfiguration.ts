import { IActor } from "../Infrastructure/IActor";
import { ITimedActorConfiguration } from "./ITimedActorConfiguration";

export interface IConfiguration {
  iotHubConnectionstring: string;
  checkCycleInterval: number;
  actors: IActor[];
  timedActorConfiguration: ITimedActorConfiguration[];
}
