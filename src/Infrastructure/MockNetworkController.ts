import { lookup } from 'dns';
import { exec, ExecResult } from 'ts-process-promises';
import { debug, error, info, warn } from 'winston';
import { INetworkController } from './INetworkController';

export class MockNetworkController implements INetworkController {
  public async connect(): Promise<any> {
    debug('pretending connecting umts, trying to exec cmd: node ./Wait5s.js');

    await exec('node ./Wait3s.js')
      .on('process', (process: any) => debug('Pid: ', process.pid))
      .then(result => {
        return new Promise<any>(resolve => {
          resolve(result.stdout);
        });
      });
  }

  public async disconnect(): Promise<any> {
    debug(
      'pretending disconnecting umts, trying to exec cmd: node ./Wait5s.js'
    );

    exec('node ./Wait3s.js')
      .on('process', (process: any) => debug('Pid: ', process.pid))
      .then(result => {
        return result.stdout;
      });
  }

  public connected(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      debug('checking internet connection');
      lookup('google.com', (err: any) => {
        if (err && err.code === 'ENOTFOUND') {
          debug('disconnected');
          resolve(false);
        } else {
          debug('connected');
          resolve(true);
        }
      });
    });
  }
}
