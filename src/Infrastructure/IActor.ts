export interface IActor {
  id: string;
  name: string;
  state: ActorState;
}

export enum ActorState {
  Off = 0,
  On = 1
}
