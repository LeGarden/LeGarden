import { INetworkConfiguration } from '../Domain/INetworkConfiguration';
import { INetworkController } from './INetworkController';

export class UmtsNetworkController implements INetworkController {
  private networkConfig: INetworkConfiguration;

  constructor(networkConfig: INetworkConfiguration) {
    this.networkConfig = networkConfig;
  }

  public setupModem(): void {
    // tslint:disable-next-line:no-console
    console.log(
      'setting up modem, trying to exec cmd: ' +
        this.networkConfig.usbModeSwitchCmd
    );

   
  }
  public connect(): void {
    // tslint:disable-next-line:no-console
    console.log(
      'connecting to umts, trying to exec cmd: ' +
        this.networkConfig.connectUmtsCmd
    );
  }
  public disconnect(): void {
    // tslint:disable-next-line:no-console
    console.log(
      'disconnecting to umts, trying to exec cmd: ' +
        this.networkConfig.disconnectUmtsCmd
    );
  }
}
