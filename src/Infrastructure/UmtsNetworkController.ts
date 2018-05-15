import { exec, ExecResult } from 'ts-process-promises';
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

    await exec(this.networkConfig.connectUmtsCmd)
      // tslint:disable-next-line:no-console
      .on('process', (process: any) => console.log('Pid: ', process.pid))
      .then((result: ExecResult) => {
        // result.stdout should be: E303C connected to E-Plus (26203). 
        // if already connected result will be the same
        const ret = { stdout: result.stdout, stderr: result.stderr };
      });
  }
  public async disconnect(): Promise<any> {
    // tslint:disable-next-line:no-console
    console.log(
      'disconnecting to umts, trying to exec cmd: ' +
        this.networkConfig.disconnectUmtsCmd
    );

    await exec(this.networkConfig.disconnectUmtsCmd)
      // tslint:disable-next-line:no-console
      .on('process', (process: any) => console.log('Pid: ', process.pid))
      .then((result: any) => {
        // result.stdout should be: Disconnected.
        // if not connected result.stdout will be: Not connected.
        return { stdout: result.stdout, stderr: result.stderr };
      });
  }
}
