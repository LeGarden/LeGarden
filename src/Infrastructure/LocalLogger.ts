import {
  createLogger,
  format,
  Logger,
  LoggerOptions,
  transports,
} from 'winston';
import { ILogger } from './ILogger';

export class LocalLogger implements ILogger {
  private logger: Logger;

  constructor() {
    const loggerOptions: LoggerOptions = {
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
          level: 'silly',
          stderrLevels: ['silly', 'error', 'debug', 'info', 'warn'],
        }),
      ],
    };

    this.logger = createLogger(loggerOptions);
  }

  public trace(msg: string): void {
    this.logger.silly(msg);
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
