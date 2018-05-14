import { INetworkController } from './INetworkController';

export class MockNetworkController implements INetworkController {
  public setupModem(): void {
    // tslint:disable-next-line:no-console
    console.log(
      'pretending setting up modem, trying to exec cmd: echo connect modem'
    );
    
  }
  public connect(): void {
    // tslint:disable-next-line:no-console
    console.log(
      'pretending connecting umts, trying to exec cmd: echo connect umts'
    );
    
  }

  public disconnect(): void {
    // tslint:disable-next-line:no-console
    console.log(
      'pretending disconnecting umts, trying to exec cmd: echo disconnect umts'
    );
   
  }
}
