import * as configfile from '../configuration.json';
import { ActorRepository } from './Domain/ActorRepository';
import { IConfiguration } from './Domain/IConfiguration';
import { LeGardenService } from './Domain/LeGardenService';
import { IClientService } from './Infrastructure/IClientService';
import { IDeviceController } from './Infrastructure/IDeviceController';
import { IotHubClientService } from './Infrastructure/IotHubClientService';
import { MockDeviceController } from './Infrastructure/MockDeviceController';

const config: IConfiguration = (configfile as any).configuration;
const client: IClientService = new IotHubClientService(
  config.iotHubConnectionstring
);
const deviceController: IDeviceController = new MockDeviceController();
const actorRepo: ActorRepository = new ActorRepository(config.actors);

const leGardenService: LeGardenService = new LeGardenService(
  config,
  actorRepo,
  client,
  deviceController
);

leGardenService.initialize();
