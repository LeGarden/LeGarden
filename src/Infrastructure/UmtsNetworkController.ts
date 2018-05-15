import { exec } from 'process-promises';
import { INetworkConfiguration } from '../Domain/INetworkConfiguration';
import { INetworkController } from './INetworkController';

export class UmtsNetworkController implements INetworkController {
  private networkConfig: INetworkConfiguration;

  constructor(networkConfig: INetworkConfiguration) {
    this.networkConfig = networkConfig;
  }

  public async connect(): Promise<any> {
    // tslint:disable-next-line:no-console
    console.log(
      'connecting to umts, trying to exec cmd: ' +
        this.networkConfig.connectUmtsCmd
    );

    exec(this.networkConfig.connectUmtsCmd)
      // tslint:disable-next-line:no-console
      .on('process', (process: any) => console.log('Pid: ', process.pid))
      .then((result: any) => {
        return { stdout: result.stdout, stderr: result.stderr };
      });
  }
  public async disconnect(): Promise<any> {
    // tslint:disable-next-line:no-console
    console.log(
      'disconnecting to umts, trying to exec cmd: ' +
        this.networkConfig.disconnectUmtsCmd
    );

    exec(this.networkConfig.disconnectUmtsCmd)
      // tslint:disable-next-line:no-console
      .on('process', (process: any) => console.log('Pid: ', process.pid))
      .then((result: any) => {
        return { stdout: result.stdout, stderr: result.stderr };
      });
  }
}
