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

  constructor(keys: any) {
    const loggerOptions: LoggerOptions = {
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
          level: 'debug',
        }),
        new transports.File({
          filename: 'main.log',
          format: format.combine(format.simple()),
          level: 'debug',
        }),
      ],
    };

    this.logger = createLogger(loggerOptions);
  }

  public debug(msg: string): void {
    this.logger.debug(msg);
  }

  public info(msg: string): void {
    this.logger.info(msg);
  }

  public warn(msg: string): void {
    this.logger.warn(msg);
  }

  public error(msg: string): void {
    this.logger.error(msg);
  }
}
