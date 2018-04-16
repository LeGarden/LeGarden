export interface IClientService {
  connected: boolean;
  connect(): void;
  disconnect(): void;
  sendEvent(data: any): void;
}
