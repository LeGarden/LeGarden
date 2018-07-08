import { lookup } from 'dns';
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
        return new Promise<any>(resolve => {
          resolve(result.stdout);
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
    return new Promise<boolean>((resolve, reject) => {
      this.logger.debug('checking internet connection');
      lookup('google.com', (err: any) => {
        if (err && err.code === 'ENOTFOUND') {
          this.logger.debug('disconnected');
          resolve(false);
        } else {
          this.logger.debug('connected');
          resolve(true);
        }
      });
    });
  }
}
