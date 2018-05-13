import { Container } from 'inversify';
import * as moment from 'moment';
import * as configfile from '../configuration.json';
import * as keysfile from '../keys.json';
import { ActorRepository } from './Domain/ActorRepository';
import { IConfiguration } from './Domain/IConfiguration';
import { ITimedActorConfiguration } from './Domain/ITimedActorConfiguration';
import { LeGardenService } from './Domain/LeGardenService';
import { IClientService } from './Infrastructure/IClientService';
import { IDeviceController } from './Infrastructure/IDeviceController';
import { IotHubClientService } from './Infrastructure/IotHubClientService';
import { MockDeviceController } from './Infrastructure/MockDeviceController';
// import { RaspyDeviceContoller } from './Infrastructure/RaspyDeviceController';

const config: IConfiguration = (configfile as any).configuration;
const keys: any = keysfile as any;

const container = new Container();
container
  .bind<IClientService>('IClientService')
  .toConstantValue(new IotHubClientService(keys.iotHubConnectionstring));

// if (os.os !== '') {
container
  .bind<IDeviceController>('IDeviceController')
  .toConstantValue(new MockDeviceController());
// } else {
// container
//   .bind<IDeviceController>('IDeviceController')
//   .toConstantValue(new RaspyDeviceContoller());
// }

const deviceController: IDeviceController = new MockDeviceController();
const actorRepo: ActorRepository = new ActorRepository(config.actors);

const leGardenService: LeGardenService = new LeGardenService(
  config,
  actorRepo,
  container.get<IClientService>('IClientService'),
  container.get<IDeviceController>('IDeviceController')
);

leGardenService.initialize();
