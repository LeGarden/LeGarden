export interface INetworkController {
  connect(): Promise<void>;
  disconnect(): void;
  connected(): Promise<boolean>;
}
