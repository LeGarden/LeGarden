export interface IEvent {
  messageId?: string;
  deviceId?: string;
  subject: string;
  eventType: string;
  subjectId: string;
  eventOccurrence?: Date;
  data: any;
}
