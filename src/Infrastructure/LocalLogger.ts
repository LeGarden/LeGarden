import { Logger, LoggerInstance, LoggerOptions, transports } from 'winston';
import { ILogger } from './ILogger';

export class LocalLogger implements ILogger {
  private logger: LoggerInstance;

  constructor() {
    const loggerOptions: LoggerOptions = {
      transports: [
        new transports.Console({
          level: 'debug',
        }),
      ],
    };

    this.logger = new Logger(loggerOptions);
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
