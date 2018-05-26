import { Client, Message } from 'azure-iot-device';
import { Mqtt } from 'azure-iot-device-mqtt';
import { Observable, Observer, Subject } from 'rxjs';
import { debug, error, info, warn } from 'winston';
import { IAction } from '../Domain/IAction';
import { IClientService } from './IClientService';

export class IotHubClientService implements IClientService {
  public connectionState: Subject<boolean> = new Subject();
  public messages: Subject<IAction> = new Subject();
  private client: Client;

  constructor(connectionString: string) {
    this.client = Client.fromConnectionString(connectionString, Mqtt);
  }

  public connect(): void {
    this.connectionState.next(false);
    this.client.open(this.onConnect.bind(this));
  }

  public disconnect(): void {
    this.client.close(this.onResult.bind(this));
  }

  public sendEvent(data: any): void {
    const message = new Message(data);
    this.client.sendEvent(message, this.onResult.bind(this));
  }

  private onConnect(err: any): void {
    if (err) {
      error('Could not connect: ' + err.message);
    } else {
      info('Client connected');
      this.connectionState.next(true);
      this.client.on('message', this.onMessage.bind(this));
      this.client.on('error', this.onError.bind(this));
      this.client.on('disconnect', this.onDisconnect.bind(this));
    }
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
    this.connectionState = Observable.create((obs: Observer<boolean>) => {
      obs.next(false);
    });
    this.client.removeAllListeners();
    this.client.open(this.onConnect.bind(this));
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
