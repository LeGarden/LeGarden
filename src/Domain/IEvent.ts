export interface IEvent {
  messageId?: string;
  deviceId?: string;
  subject: string;
  eventType: string;
  subjectId: string;
  data: any;
}
