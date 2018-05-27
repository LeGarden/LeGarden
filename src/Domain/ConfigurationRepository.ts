import { Twin } from 'azure-iot-device';
import { debug, warn } from 'winston';
import { IClientService } from '../Infrastructure/IClientService';
import { IConfiguration } from './IConfiguration';

export class ConfigurationRepository {
  private configRef: string;
  private client: IClientService;

  constructor(configRef: string, client: IClientService) {
    this.configRef = configRef;
    this.client = client;
  }

  public async get(): Promise<IConfiguration> {
    return new Promise<IConfiguration>((resolve, reject) => {
      if (this.client.connectionStatus === true) {
        this.client
          .getTwin()
          .then((twin: Twin) => {
            if (twin) {
              debug('got config from twin.');
              resolve(twin.properties.desired.configuration);
            } else {
              warn('got config from file, because of error in connection.');
              this.importConfigFile().then(file => {
                resolve(file);
              });
            }
          })
          .catch((reason: string) => {
            warn('got config from file, because of error in connection.');
            this.importConfigFile().then(file => {
              resolve(file);
            });
          });
      } else {
        debug('got config from file.');
        this.importConfigFile().then(file => {
          resolve(file);
        });
      }
    });
  }

  private async importConfigFile(): Promise<IConfiguration> {
    return import(this.configRef);
  }
}
