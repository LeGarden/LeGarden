import { exec } from 'process-promises';
import { INetworkController } from './INetworkController';

export class MockNetworkController implements INetworkController {
  public async connect(): Promise<any> {
    // tslint:disable-next-line:no-console
    console.log(
      'pretending connecting umts, trying to exec cmd: node ./Wait5s.js'
    );

    await exec('node ./Wait3s.js')
      // tslint:disable-next-line:no-console
      .on('process', (process: any) => console.log('Pid: ', process.pid))
      .then(result => {
        // tslint:disable-next-line:no-console
        // console.log(result);
        return new Promise<any>(resolve => {
          resolve(result.stdout);
        });
      });
  }

  public async disconnect(): Promise<any> {
    // tslint:disable-next-line:no-console
    console.log(
      'pretending disconnecting umts, trying to exec cmd: node ./Wait5s.js'
    );

    exec('node ./Wait3s.js')
      // tslint:disable-next-line:no-console
      .on('process', (process: any) => console.log('Pid: ', process.pid))
      .then(result => {
        return result.stdout;
      });
  }
}
