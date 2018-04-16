"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IotHubClientService_1 = require("./Infrastructure/IotHubClientService");
var connectionString = 'HostName=LeGardenHub.azure-devices.net;DeviceId=raspi@legarden;SharedAccessKey=5XXrfzqV9LKrVSY2tuF3eUPImjXkbjAqL3/wbOK6cx4=';
var client = new IotHubClientService_1.IotHubClientService(connectionString);
var sendInterval = setInterval(function () {
    var windSpeed = 10 + Math.random() * 4;
    var temperature = 20 + Math.random() * 10;
    var humidity = 60 + Math.random() * 20;
    var data = JSON.stringify({
        deviceId: 'myFirstDevice',
        humidity: humidity,
        temperature: temperature,
        windSpeed: windSpeed,
    });
    client.sendEvent(data);
}, 2000);
client.connect();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNEVBQTJFO0FBRTNFLElBQU0sZ0JBQWdCLEdBQ3BCLDZIQUE2SCxDQUFDO0FBQ2hJLElBQU0sTUFBTSxHQUFtQixJQUFJLHlDQUFtQixDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFFekUsSUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDO0lBQy9CLElBQU0sU0FBUyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLElBQU0sV0FBVyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQzVDLElBQU0sUUFBUSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3pDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDMUIsUUFBUSxFQUFFLGVBQWU7UUFDekIsUUFBUSxVQUFBO1FBQ1IsV0FBVyxhQUFBO1FBQ1gsU0FBUyxXQUFBO0tBQ1YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFVCxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMifQ==