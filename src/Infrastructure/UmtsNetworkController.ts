// tslint:disable-next-line:no-implicit-dependencies
import cmd = require('node-cmd');
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

    cmd.get(
      this.networkConfig.usbModeSwitchCmd,
      (err: any, data: any, stderr: any) => {
        if (!err) {
          // tslint:disable-next-line:no-console
          console.log('the cmd returned:\n\n', data);
        } else {
          // tslint:disable-next-line:no-console
          console.log('error', err);
        }
      }
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
