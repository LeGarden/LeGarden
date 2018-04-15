// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Client, Message } from 'azure-iot-device';
import { Mqtt } from 'azure-iot-device-mqtt';
import { IClientService } from './IClientService';
import { IotHubClientService } from './IotHubClientService';

const connectionString = 'HostName=LeGardenHub.azure-devices.net;DeviceId=raspi@legarden;SharedAccessKey=5XXrfzqV9LKrVSY2tuF3eUPImjXkbjAqL3/wbOK6cx4=';
const client: IClientService = new IotHubClientService(connectionString);

  // Create a message and send it to the IoT Hub every second
  const sendInterval = setInterval(() => {
    const windSpeed = 10 + (Math.random() * 4); // range: [10, 14]
    const temperature = 20 + (Math.random() * 10); // range: [20, 30]
    const humidity = 60 + (Math.random() * 20); // range: [60, 80]
    const data = JSON.stringify({ deviceId: 'myFirstDevice', windSpeed, temperature, humidity });
    const message = new Message(data);
  // tslint:disable-next-line:no-console
    console.log('Sending message: ' + message.getData());
    client.sendEvent(data);
  }, 2000);
  
  client.connect();
