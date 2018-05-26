import { Container } from 'inversify';
import * as moment from 'moment';
import {
  configure,
  ConsoleTransportInstance,
  LoggerOptions,
  transports,
} from 'winston';
import * as configfile from '../configuration.json';
import * as keysfile from '../keys.json';
import { ActorRepository } from './Domain/ActorRepository';
import { IConfiguration } from './Domain/IConfiguration';
import { ITimedActorConfiguration } from './Domain/ITimedActorConfiguration';
import { LeGardenService } from './Domain/LeGardenService';
import { IClientService } from './Infrastructure/IClientService';
import { IDeviceController } from './Infrastructure/IDeviceController';
import { INetworkController } from './Infrastructure/INetworkController';
import { IotHubClientService } from './Infrastructure/IotHubClientService';
import { MockDeviceController } from './Infrastructure/MockDeviceController';
import { MockNetworkController } from './Infrastructure/MockNetworkController';
import { UmtsNetworkController } from './Infrastructure/UmtsNetworkController';

// tslint:disable-next-line:no-var-requires
const isPi = require('detect-rpi');
main();

async function main() {
  const config: IConfiguration = (configfile as any).configuration;
  const keys: any = keysfile as any;

  const loggerOptions: LoggerOptions = {
    transports: [
      new transports.Console({
        level: 'debug',
      }),
    ],
  };

  const container = new Container();
  container
    .bind<IClientService>('IClientService')
    .toConstantValue(new IotHubClientService(keys.iotHubConnectionstring));

  if (isPi() === false) {
    container
      .bind<IDeviceController>('IDeviceController')
      .toConstantValue(new MockDeviceController());
    container
      .bind<INetworkController>('INetworkController')
      .toConstantValue(new MockNetworkController());
  } else {
    if (loggerOptions.transports) {
      const fileTransport = new transports.File({
        filename: 'main.log',
        level: 'debug',
      });
      loggerOptions.transports.push(fileTransport);
    }

    const module = await importRaspyDeviceContollerModule();
    container
      .bind<IDeviceController>('IDeviceController')
      .toConstantValue(new module.RaspyDeviceContoller());
    container
      .bind<INetworkController>('INetworkController')
      .toConstantValue(new UmtsNetworkController(config.network));
  }

  configure(loggerOptions);

  const actorRepo: ActorRepository = new ActorRepository(config.actors);

  const leGardenService: LeGardenService = new LeGardenService(
    config,
    actorRepo,
    container.get<IClientService>('IClientService'),
    container.get<IDeviceController>('IDeviceController'),
    container.get<INetworkController>('INetworkController')
  );

  leGardenService.initialize();
}

async function importRaspyDeviceContollerModule(): Promise<any> {
  return import('./Infrastructure/RaspyDeviceController');
}
