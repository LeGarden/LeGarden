import {
  DeviceMethodRequest,
  DeviceMethodResponse,
  Twin,
} from 'azure-iot-device';
import { Observable, Subject } from 'rxjs';
import { IAction } from '../Domain/IAction';

export interface IClientService {
  connectionStatus: boolean;
  messages: Subject<IAction>;
  connect(): Promise<boolean>;
  disconnect(): void;
  sendEvent(data: any): void;
  onDeviceMethod(
    methodName: string,
    callback: (
      request: DeviceMethodRequest,
      response: DeviceMethodResponse
    ) => void
  ): void;
  getTwin(): Promise<Twin>;
}
