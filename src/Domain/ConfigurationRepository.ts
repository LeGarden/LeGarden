import { Twin } from 'azure-iot-device';
import { absolute, writeFile } from 'fs-plus';
import { IClientService } from '../Infrastructure/IClientService';
import { ILogger } from '../Infrastructure/ILogger';
import { IConfiguration } from './IConfiguration';

export class ConfigurationRepository {
  private configRef: string;
  private client: IClientService;

  constructor(
    private logger: ILogger,
    configRef: string,
    client: IClientService
  ) {
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
              this.logger.debug('got config from twin.');
              resolve(twin.properties.desired.configuration);
              this.persistConfig(twin);
            } else {
              this.importConfigFile().then(file => {
                this.logger.warn(
                  'got config from file, because of error in connection.'
                );
                resolve(file.configuration);
              });
            }
          })
          .catch((reason: string) => {
            this.importConfigFile().then(file => {
              this.logger.warn('got config from file, because of ' + reason);
              resolve(file.configuration);
            });
          });
      } else {
        this.importConfigFile().then(file => {
          this.logger.debug('got config from file.');
          resolve(file.configuration);
        });
      }
    });
  }

  private persistConfig(twin: Twin) {
    const path = absolute('configuration.json');
    this.logger.debug('persisting config to ' + path);

    const config = { configuration: twin.properties.desired.configuration };

    writeFile(
      path,
      JSON.stringify(config, null, '\t'),
      {
        encoding: 'UTF-8',
      },
      (err: any) => {
        if (err) {
          this.logger.warn('could not persist twinconfig.');
        } else {
          this.logger.debug('persisted twinconfig.');
        }
      }
    );
  }

  private async importConfigFile(): Promise<any> {
    return import(this.configRef);
  }
}
