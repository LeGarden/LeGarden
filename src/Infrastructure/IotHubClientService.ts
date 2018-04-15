import { Client, Message } from "azure-iot-device";
import { Mqtt } from 'azure-iot-device-mqtt';
import { IClientService } from "./IClientService";

export class IotHubClientService implements IClientService {
    public connected: boolean = false;
    private connectionString: string;
    private client: Client;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
        this.client = Client.fromConnectionString(connectionString, Mqtt);
    }

    public connect(): void {
        this.client.open(this.onConnect);
    }

    public disconnect(): void {
        this.client.close(this.onResult)
    }

    public sendEvent(data: any): void {
        const message = new Message(data);
        this.client.sendEvent(message, this.onResult)
    }

    private onConnect(err: any): void {
        if(err) {
            // tslint:disable-next-line:no-console
            console.error('Could not connect: ' + err.message);
        } else {
            // tslint:disable-next-line:no-console
            console.log('Client connected');
            this.connected = true;
            this.client.on('message', this.onMessage);
            this.client.on('error', this.onError);
            this.client.on('disconnect', this.onDisconnect);
        }
    }

    private onError(err: any): void {
        // tslint:disable-next-line:no-console
        console.error(err.message);
    }

    private onMessage(message: Message): void {
        // tslint:disable-next-line:no-console
        console.log('Id: ' + message.messageId + ' Body: ' + message.data);
        this.client.complete(message, this.onResult);
    };

    private onDisconnect(): void {
        this.connected = false;
        this.client.removeAllListeners();
        this.client.open(this.onConnect);
    };

    private onResult(err: any, result: any): void {
        if (err !== undefined) {
            // tslint:disable-next-line:no-console
            console.error('error: ' + err.toString());
        }
        if (result !== undefined) {
            // tslint:disable-next-line:no-console
            console.log('result: ' + result.constructor.name);
        }
    }
}