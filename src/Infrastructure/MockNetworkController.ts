import { resolve } from 'dns';
import { exec, ExecResult } from 'ts-process-promises';
import { ILogger } from './ILogger';
import { INetworkController } from './INetworkController';

export class MockNetworkController implements INetworkController {
  constructor(private logger: ILogger) {}

  public async connect(): Promise<any> {
    this.logger.debug(
      'pretending connecting umts, trying to exec cmd: node ./Wait5s.js'
    );

    await exec('node ./Wait3s.js')
      .on('process', (process: any) => this.logger.debug('Pid: ' + process.pid))
      .then(result => {
        return new Promise<any>(res => {
          res(result.stdout);
        });
      });
  }

  public async disconnect(): Promise<any> {
    this.logger.debug(
      'pretending disconnecting umts, trying to exec cmd: node ./Wait5s.js'
    );

    exec('node ./Wait3s.js')
      .on('process', (process: any) => this.logger.debug('Pid: ' + process.pid))
      .then(result => {
        return result.stdout;
      });
  }

  public connected(): Promise<boolean> {
    return new Promise<boolean>((res, reject) => {
      this.logger.trace('checking internet connection');
      resolve('google.com', (err: any) => {
        this.logger.trace('error: ' + err);
        if (err) {
          this.logger.debug('disconnected');
          res(false);
        } else {
          this.logger.trace('connected');
          res(true);
        }
      });
    });
  }
}
