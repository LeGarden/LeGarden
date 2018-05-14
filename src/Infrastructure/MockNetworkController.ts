import cmd = require('node-cmd');
import { INetworkController } from './INetworkController';

export class MockNetworkController implements INetworkController {
  public setupModem(): void {
    // tslint:disable-next-line:no-console
    console.log(
      'pretending setting up modem, trying to exec cmd: echo connect modem'
    );
    cmd.get('echo connect modem', (err: any, data: any, stderr: any) => {
      if (!err) {
        // tslint:disable-next-line:no-console
        console.log('the cmd returned:\n\n', data);
      } else {
        // tslint:disable-next-line:no-console
        console.log('the cmd returned error:\n\n', err);
      }
    });
  }
  public connect(): void {
    // tslint:disable-next-line:no-console
    console.log(
      'pretending connecting umts, trying to exec cmd: echo connect umts'
    );
    cmd.get('echo connect umts', (err: any, data: any, stderr: any) => {
      if (!err) {
        // tslint:disable-next-line:no-console
        console.log('the cmd returned:\n\n', data);
      } else {
        // tslint:disable-next-line:no-console
        console.log('the cmd returned error:\n\n', err);
      }
    });
  }

  public disconnect(): void {
    // tslint:disable-next-line:no-console
    console.log(
      'pretending disconnecting umts, trying to exec cmd: echo disconnect umts'
    );
    cmd.get('echo disconnect umts', (err: any, data: any, stderr: any) => {
      if (!err) {
        // tslint:disable-next-line:no-console
        console.log('the cmd returned:\n\n', data);
      } else {
        // tslint:disable-next-line:no-console
        console.log('the cmd returned error:\n\n', err);
      }
    });
  }
}
