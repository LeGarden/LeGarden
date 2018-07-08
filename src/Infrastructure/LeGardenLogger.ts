import { Logger, LoggerInstance, LoggerOptions, transports } from 'winston';
import { ILogger } from './ILogger';

// tslint:disable-next-line:no-var-requires
const aiLogger = require('winston-azure-application-insights')
  .AzureApplicationInsightsLogger;

export class LeGardenLogger implements ILogger {
  private logger: LoggerInstance;

  constructor(keys: any) {
    const loggerOptions: LoggerOptions = {
      transports: [
        new transports.Console({
          level: 'debug',
        }),
        new transports.File({
          filename: 'main.log',
          level: 'debug',
        }),
        new aiLogger({
          key: keys.applicationInsightsKey,
          level: 'info',
          treatErrorsAsExceptions: true,
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
