import { Container } from 'inversify';
import * as moment from 'moment';
import {
  configure,
  ConsoleTransportInstance,
  debug,
  LoggerOptions,
  transports,
} from 'winston';
import * as configfile from '../configuration.json';
import * as keysfile from '../keys.json';
import { ActorRepository } from './Domain/ActorRepository';
import { ConfigurationRepository } from './Domain/ConfigurationRepository';
import { IConfiguration } from './Domain/IConfiguration';
import { ITimedActorConfiguration } from './Domain/ITimedActorConfiguration';
import { LeGardenService } from './Domain/LeGardenService';
import { IActor } from './Infrastructure/IActor';
import { IClientService } from './Infrastructure/IClientService';
import { IDeviceController } from './Infrastructure/IDeviceController';
import { INetworkController } from './Infrastructure/INetworkController';
import { IotHubClientService } from './Infrastructure/IotHubClientService';
import { MockDeviceController } from './Infrastructure/MockDeviceController';
import { MockNetworkController } from './Infrastructure/MockNetworkController';
import { UmtsNetworkController } from './Infrastructure/UmtsNetworkController';

// tslint:disable-next-line:no-var-requires
const isPi = require('detect-rpi');
// tslint:disable-next-line:no-var-requires
const aiLogger = require('winston-azure-application-insights')
  .AzureApplicationInsightsLogger;
main();

async function main() {
  const keys: any = keysfile as any;

  const loggerOptions: LoggerOptions = {
    transports: [
      new transports.Console({
        level: 'debug',
      }),
    ],
  };
  configure(loggerOptions);

  let config: IConfiguration | null = null;
  let configRepo: ConfigurationRepository | null = null;
  let clientService: IClientService | null = null;
  const container = new Container();

  if (isPi() === false) {
    debug('using mock dicontainer');
    container
      .bind<IClientService>('IClientService')
      .toConstantValue(
        new IotHubClientService(keys.iotHubConnectionstringTest)
      );

    clientService = container.get<IClientService>('IClientService');
    configRepo = new ConfigurationRepository(
      '../../configuration.json',
      clientService
    );
    config = await configRepo.get();

    container
      .bind<IDeviceController>('IDeviceController')
      .toConstantValue(new MockDeviceController());
    container
      .bind<INetworkController>('INetworkController')
      .toConstantValue(new MockNetworkController());
  } else {
    debug('using productive dicontainer');
    if (loggerOptions.transports) {
      const fileTransport = new transports.File({
        filename: 'main.log',
        level: 'debug',
      });

      const aiTransport = new aiLogger({
        key: keys.applicationInsightsKey,
        level: 'info',
        treatErrorsAsExceptions: true,
      });

      loggerOptions.transports.push(fileTransport);
      loggerOptions.transports.push(aiTransport);
    }
    configure(loggerOptions);

    container
      .bind<IClientService>('IClientService')
      .toConstantValue(new IotHubClientService(keys.iotHubConnectionstring));

    clientService = container.get<IClientService>('IClientService');
    configRepo = new ConfigurationRepository(
      '../../configuration.json',
      clientService
    );
    config = await configRepo.get();

    const module = await importRaspyDeviceContollerModule();
    container
      .bind<IDeviceController>('IDeviceController')
      .toConstantValue(new module.RaspyDeviceContoller());
    container
      .bind<INetworkController>('INetworkController')
      .toConstantValue(new UmtsNetworkController(config.network));
  }

  const actors: IActor[] = [];

  for (const key in config.actors) {
    if (key) {
      const tac: IActor = config.actors[key];
      actors.push(tac);
      debug('registered actor with id ' + tac.id);
    }
  }

  const actorRepo: ActorRepository = new ActorRepository(actors);

  const leGardenService: LeGardenService = new LeGardenService(
    configRepo,
    actorRepo,
    clientService,
    container.get<IDeviceController>('IDeviceController'),
    container.get<INetworkController>('INetworkController')
  );

  leGardenService.initialize();
}

async function importRaspyDeviceContollerModule(): Promise<any> {
  return import('./Infrastructure/RaspyDeviceController');
}
