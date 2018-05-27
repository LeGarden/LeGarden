import { Twin } from 'azure-iot-device';
import { absolute, writeFile } from 'fs-plus';
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
              this.persistConfig(twin);
            } else {
              this.importConfigFile().then(file => {
                warn('got config from file, because of error in connection.');
                resolve(file.configuration);
              });
            }
          })
          .catch((reason: string) => {
            this.importConfigFile().then(file => {
              warn('got config from file, because of error in connection.');
              resolve(file.configuration);
            });
          });
      } else {
        this.importConfigFile().then(file => {
          debug('got config from file.');
          resolve(file.configuration);
        });
      }
    });
  }

  private persistConfig(twin: Twin) {
    const path = absolute('configuration.json');
    debug('persisting config to ' + path);
    writeFile(
      path,
      JSON.stringify(twin.properties.desired.configuration, null, "\t"),
      {
        encoding: 'UTF-8',
      },
      (err: any) => {
        if (err) {
          warn('could not persist twinconfig.');
        } else {
          debug('persisted twinconfig.');
        }
      }
    );
  }

  private async importConfigFile(): Promise<any> {
    return import(this.configRef);
  }
}
