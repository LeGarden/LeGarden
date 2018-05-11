import { Observable, Subject } from 'rxjs';
import { IAction } from '../Domain/IAction';

export interface IClientService {
  connectionState: Subject<boolean>;
  messages: Subject<IAction>;
  connect(): void;
  disconnect(): void;
  sendEvent(data: any): void;
}
