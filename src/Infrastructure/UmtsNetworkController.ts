import { lookup } from 'dns';
import { exec, ExecResult } from 'ts-process-promises';
import { INetworkConfiguration } from '../Domain/INetworkConfiguration';
import { ILogger } from './ILogger';
import { INetworkController } from './INetworkController';

export class UmtsNetworkController implements INetworkController {
  private networkConfig: INetworkConfiguration;

  constructor(networkConfig: INetworkConfiguration, private logger: ILogger) {
    this.networkConfig = networkConfig;
  }

  public connected(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.logger.trace('checking umts connection');

      try {
        lookup('google.com', (err: any) => {
          this.logger.trace('error: ' + err);
          if (err && err.code === 'ENOTFOUND') {
            this.logger.debug('disconnected');
            resolve(false);
          } else {
            this.logger.trace('connected');
            resolve(true);
          }
        });
      } catch (error) {
        this.logger.error(error);
        resolve(false);
      }
    });
  }

  // ToDo: Return a chackable Promise indicating if connected
  public async connect(): Promise<any> {
    this.logger.debug(
      'connecting to umts, trying to exec cmd: ' +
        this.networkConfig.connectUmtsCmd
    );

    await exec(this.networkConfig.connectUmtsCmd)
      .on('process', (process: any) => this.logger.debug('Pid: ' + process.pid))
      .then((result: ExecResult) => {
        // result.stdout should be: E303C connected to E-Plus (26203).
        // if already connected result will be the same
        const ret = { stdout: result.stdout, stderr: result.stderr };
      });
  }
  public async disconnect(): Promise<any> {
    // tslint:disable-next-line:no-console
    this.logger.debug(
      'disconnecting to umts, trying to exec cmd: ' +
        this.networkConfig.disconnectUmtsCmd
    );

    await exec(this.networkConfig.disconnectUmtsCmd)
      // tslint:disable-next-line:no-console
      .on('process', (process: any) => this.logger.debug('Pid: ' + process.pid))
      .then((result: any) => {
        // result.stdout should be: Disconnected.
        // if not connected result.stdout will be: Not connected.
        return { stdout: result.stdout, stderr: result.stderr };
      });
  }
}
