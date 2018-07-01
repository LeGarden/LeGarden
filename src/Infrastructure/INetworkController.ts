export interface INetworkController {
  connect(): void;
  disconnect(): void;
  connected(): Promise<boolean>;
}
