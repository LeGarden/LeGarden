export interface INetworkController {
  setupModem(): void;
  connect(): void;
  disconnect(): void;
}
