import { IClientService } from "../Infrastructure/IClientService";
import { IDeviceController } from "../Infrastructure/IDeviceController";
import { IConfiguration } from "./IConfiguration";

export class LeGardenService {

    private clientService: IClientService;
    private deviceController: IDeviceController;
    private config: IConfiguration;

    constructor(config: IConfiguration, clientService: IClientService, deviceController: IDeviceController) {
        this.clientService = clientService;
        this.deviceController = deviceController;
        this.config = config;
    }

    // tslint:disable-next-line:no-empty
    public initialize(): void {
        
    }

    private check(): void {
        // tslint:disable-next-line:no-console
        console.log('checking..');
        const windSpeed = 10 + Math.random() * 4; // range: [10, 14]
        const temperature = 20 + Math.random() * 10; // range: [20, 30]
        const humidity = 60 + Math.random() * 20; // range: [60, 80]
        const data = JSON.stringify({
            deviceId: 'myFirstDevice',
            humidity,
            temperature,
            windSpeed,
        });
        this.clientService.sendEvent(data);
    }
}