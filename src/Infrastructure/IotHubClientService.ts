import {
  Client,
  DeviceMethodRequest,
  DeviceMethodResponse,
  Message,
  Twin,
} from 'azure-iot-device';
import { Mqtt } from 'azure-iot-device-mqtt';
import { Observable, Observer, Subject } from 'rxjs';
import { debug, error, info, warn } from 'winston';
import { IAction } from '../Domain/IAction';
import { IClientService } from './IClientService';

export class IotHubClientService implements IClientService {
  public connectionStatus: boolean = false;
  // public connectionState: Subject<boolean> = new Subject();
  public messages: Subject<IAction> = new Subject();
  private client: Client;

  constructor(connectionString: string) {
    this.client = Client.fromConnectionString(connectionString, Mqtt);
  }

  public connect(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.client.open((err?: Error, result?: any) => {
        if (err) {
          this.connectionStatus = false;
          error('Could not connect: ' + err.message);
          reject(false);
        }
        if (result) {
          this.client.on('message', this.onMessage.bind(this));
          this.client.on('error', this.onError.bind(this));
          this.client.on('disconnect', this.onDisconnect.bind(this));
          this.connectionStatus = true;
          debug('Client connected');
          resolve(true);
        }
      });
    });
  }

  public disconnect(): void {
    this.client.close(this.onDisconnect.bind(this));
  }

  public sendEvent(data: any): void {
    const message = new Message(data);
    this.client.sendEvent(message, this.onResult.bind(this));
  }

  public onDeviceMethod(
    methodName: string,
    callback: (
      request: DeviceMethodRequest,
      response: DeviceMethodResponse
    ) => void
  ): void {
    this.client.onDeviceMethod(methodName, callback);
  }

  public getTwin(): Promise<Twin> {
    return new Promise<Twin>((resolve, reject) => {
      this.client.getTwin((e?: Error, twin?: Twin) => {
        if (e) {
          error(e.message);
          reject(e.message);
        } else {
          if (twin) {
            resolve(twin);
          }
          reject('no twin received!');
        }
      });
    });
  }

  private onError(err: any): void {
    error(err.message);
  }

  private onMessage(message: Message): void {
    info('Id: ' + message.messageId + ' Body: ' + message.data);
    const actionData: IAction = message.data;

    this.messages.next(actionData);

    this.client.complete(message, this.onResult.bind(this));
  }

  private onDisconnect(): void {
    this.connectionStatus = false;
    this.client.removeAllListeners();
  }

  private onResult(err: any, result: any): void {
    if (err) {
      error('error: ' + err.toString());
    }
    if (result) {
      debug('result: ' + result.constructor.name);
    }
  }
}
