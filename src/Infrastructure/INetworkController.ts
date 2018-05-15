export interface INetworkController {
  connect(): Promise<any>;
  disconnect(): Promise<any>;
}
