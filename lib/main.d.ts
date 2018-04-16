declare module "Infrastructure/IClientService" {
    export interface IClientService {
        connected: boolean;
        connect(): void;
        disconnect(): void;
        sendEvent(data: any): void;
    }
}
declare module "Domain/IAction" {
    export interface IAction {
        subject: string;
        subjectId: string;
        data: any;
    }
}
declare module "Infrastructure/IotHubClientService" {
    import { IClientService } from "Infrastructure/IClientService";
    export class IotHubClientService implements IClientService {
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
}
declare module "main" {
}
