import { Container } from 'inversify';
import * as keysfile from '../keys.json';
import { ActorRepository } from './Domain/ActorRepository';
import { ConfigurationRepository } from './Domain/ConfigurationRepository';
import { IConfiguration } from './Domain/IConfiguration';
import { LeGardenService } from './Domain/LeGardenService';
import { IActor } from './Infrastructure/IActor';
import { IClientService } from './Infrastructure/IClientService';
import { IDeviceController } from './Infrastructure/IDeviceController';
import { ILogger } from './Infrastructure/ILogger';
import { INetworkController } from './Infrastructure/INetworkController';
import { IotHubClientService } from './Infrastructure/IotHubClientService';
import { MockDeviceController } from './Infrastructure/MockDeviceController';
import { MockNetworkController } from './Infrastructure/MockNetworkController';
import { UmtsNetworkController } from './Infrastructure/UmtsNetworkController';

import { LeGardenLogger } from './Infrastructure/LeGardenLogger';
import { LocalLogger } from './Infrastructure/LocalLogger';

// tslint:disable-next-line:no-var-requires
const isPi = require('detect-rpi');

main();

async function main() {
  const keys: any = keysfile as any;

  let config: IConfiguration | null = null;
  let configRepo: ConfigurationRepository | null = null;
  let clientService: IClientService | null = null;
  const container = new Container();

  let logger: ILogger;
  if (isPi() === false) {
    container
      .bind<ILogger>('ILogger')
      .toConstantValue(new LocalLogger());
    logger = container.get<ILogger>('ILogger');
    logger.debug('using DebugContainer');
    container
      .bind<IClientService>('IClientService')
      .toConstantValue(
        new IotHubClientService(keys.iotHubConnectionstringTest, logger)
      );

    clientService = container.get<IClientService>('IClientService');
    configRepo = new ConfigurationRepository(
      logger,
      '../../configuration.json',
      clientService
    );
    config = await configRepo.get();
    container
      .bind<IDeviceController>('IDeviceController')
      .toConstantValue(new MockDeviceController(logger));
    container
      .bind<INetworkController>('INetworkController')
      .toConstantValue(new MockNetworkController(logger));
  } else {
    container
      .bind<ILogger>('ILogger')
      .toConstantValue(new LeGardenLogger(keys));
    logger = container.get<ILogger>('ILogger');
    logger.debug('using ProductiveContainer');

    container
      .bind<IClientService>('IClientService')
      .toConstantValue(
        new IotHubClientService(keys.iotHubConnectionstring, logger)
      );

    clientService = container.get<IClientService>('IClientService');
    configRepo = new ConfigurationRepository(
      logger,
      '../../configuration.json',
      clientService
    );
    config = await configRepo.get();

    const module = await importRaspyDeviceContollerModule();
    container
      .bind<IDeviceController>('IDeviceController')
      .toConstantValue(new module.RaspyDeviceContoller(logger));
    container
      .bind<INetworkController>('INetworkController')
      .toConstantValue(new UmtsNetworkController(config.network, logger));
  }

  const actors: IActor[] = [];

  for (const key in config.actors) {
    if (key) {
      const tac: IActor = config.actors[key];
      actors.push(tac);
      logger.debug('registered actor with id ' + tac.id);
    }
  }

  const actorRepo: ActorRepository = new ActorRepository(actors);

  const leGardenService: LeGardenService = new LeGardenService(
    logger,
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
