export interface IActor {
    id: string;
    name: string;
    state: ActorState;
}

export enum ActorState {
    On,
    Off
}