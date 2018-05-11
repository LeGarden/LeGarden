import * as configfile from '../configuration.json';
import * as keysfile from '../keys.json';
import { ActorRepository } from './Domain/ActorRepository';
import { IConfiguration } from './Domain/IConfiguration';
import { LeGardenService } from './Domain/LeGardenService';
import { IClientService } from './Infrastructure/IClientService';
import { IDeviceController } from './Infrastructure/IDeviceController';
import { IotHubClientService } from './Infrastructure/IotHubClientService';
import { MockDeviceController } from './Infrastructure/MockDeviceController';

const config: IConfiguration = (configfile as any).configuration;
const keys: any = (keysfile as any);
const client: IClientService = new IotHubClientService(
  keys.iotHubConnectionstring
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
