import { IActor } from '../Infrastructure/IActor';

export class ActorRepository {
  private actors: IActor[] = [];

  constructor(actors: IActor[]) {
    this.actors = actors;
  }

  public getAll(): IActor[] {
    return this.actors;
  }

  public get(id: string): IActor | undefined {
    return this.actors.find(x => x.id === id);
  }

  public clone(actor: IActor | undefined): IActor | undefined {
    if (actor !== undefined) {
      return {
        id: actor.id,
        name: actor.name,
        onCallback: undefined,
        state: actor.state,
      };
    }
    return actor;
  }
}
