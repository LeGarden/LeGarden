export interface IActor {
  id: string;
  name: string;
  state: ActorState;
  onCallback?: NodeJS.Timer;
}

export enum ActorState {
  Off = 0,
  On = 1,
}
