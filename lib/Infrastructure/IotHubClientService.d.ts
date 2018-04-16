import { IClientService } from "./IClientService";
export declare class IotHubClientService implements IClientService {
    connected: boolean;
    private connectionString;
    private client;
    constructor(connectionString: string);
    connect(): void;
    disconnect(): void;
    sendEvent(data: any): void;
    private onConnect(err);
    private onError(err);
    private onMessage(message);
    private onDisconnect();
    private onResult(err, result);
}
