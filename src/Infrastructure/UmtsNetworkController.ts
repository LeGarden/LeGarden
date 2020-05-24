import { resolve } from 'dns';
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
    return new Promise<boolean>((res, reject) => {
      this.logger.trace('checking umts connection');

      try {
        resolve('google.com', (err: any) => {
          if (err) {
            this.logger.warn('error: ' + err);
            this.logger.debug('disconnected');
            res(false);
          } else {
            this.logger.trace('connected');
            res(true);
          }
        });
      } catch (error) {
        this.logger.error(error);
        res(false);
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
