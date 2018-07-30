import { Contracts, TelemetryClient } from 'applicationinsights';
import {
  createLogger,
  format,
  Logger,
  LoggerOptions,
  transports,
} from 'winston';
import { ILogger } from './ILogger';

export class LeGardenLogger implements ILogger {
  private logger: Logger;
  private aiClient: TelemetryClient;
  private aiProperties: { [id: string]: string } = {};

  constructor(keys: any) {
    const fileformat = format.printf(info => {
      return `[${info.timestamp}] ${info.level}: ${info.message}`;
    });

    const loggerOptions: LoggerOptions = {
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
          level: 'silly',
        }),
        new transports.File({
          filename: 'main.log',
          format: format.combine(format.timestamp(), fileformat),
          level: 'silly',
        }),
      ],
    };

    this.aiClient = new TelemetryClient(keys.applicationInsightsKey);
    this.aiClient.context.keys.deviceId = keys.deviceId;
    this.aiClient.context.keys.userId = keys.deviceId;

    this.logger = createLogger(loggerOptions);
  }

  // tslint:disable-next-line:no-empty
  public trace(msg: string): void {
    this.logger.silly(msg);
  }

  public debug(msg: string): void {
    this.logger.debug(msg);
  }

  public info(msg: string): void {
    this.logger.info(msg);
    this.aiClient.trackTrace({
      message: msg,
      properties: this.aiProperties,
      severity: Contracts.SeverityLevel.Information,
      time: new Date(),
    });
  }

  public warn(msg: string): void {
    this.logger.warn(msg);
    this.aiClient.trackTrace({
      message: msg,
      properties: this.aiProperties,
      severity: Contracts.SeverityLevel.Warning,
      time: new Date(),
    });
  }

  public error(msg: string): void {
    this.logger.error(msg);
    this.aiClient.trackTrace({
      message: msg,
      properties: this.aiProperties,
      severity: Contracts.SeverityLevel.Error,
      time: new Date(),
    });
  }
}
