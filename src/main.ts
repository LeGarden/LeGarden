import { IClientService } from './Infrastructure/IClientService';
import { IotHubClientService } from './Infrastructure/IotHubClientService';

const connectionString = 'HostName=LeGardenHub.azure-devices.net;DeviceId=raspi@legarden;SharedAccessKey=5XXrfzqV9LKrVSY2tuF3eUPImjXkbjAqL3/wbOK6cx4=';
const client: IClientService = new IotHubClientService(connectionString);

const sendInterval = setInterval(() => {
  const windSpeed = 10 + (Math.random() * 4); // range: [10, 14]
  const temperature = 20 + (Math.random() * 10); // range: [20, 30]
  const humidity = 60 + (Math.random() * 20); // range: [60, 80]
  const data = JSON.stringify({ deviceId: 'myFirstDevice', windSpeed, temperature, humidity });
  client.sendEvent(data);
}, 2000);
  
client.connect();
