System.register("Infrastructure/IClientService", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Domain/IAction", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Infrastructure/IotHubClientService", ["azure-iot-device", "azure-iot-device-mqtt"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var azure_iot_device_1, azure_iot_device_mqtt_1, IotHubClientService;
    return {
        setters: [
            function (azure_iot_device_1_1) {
                azure_iot_device_1 = azure_iot_device_1_1;
            },
            function (azure_iot_device_mqtt_1_1) {
                azure_iot_device_mqtt_1 = azure_iot_device_mqtt_1_1;
            }
        ],
        execute: function () {
            IotHubClientService = (function () {
                function IotHubClientService(connectionString) {
                    this.connected = false;
                    this.connectionString = connectionString;
                    this.client = azure_iot_device_1.Client.fromConnectionString(connectionString, azure_iot_device_mqtt_1.Mqtt);
                }
                IotHubClientService.prototype.connect = function () {
                    this.client.open(this.onConnect);
                };
                IotHubClientService.prototype.disconnect = function () {
                    this.client.close(this.onResult);
                };
                IotHubClientService.prototype.sendEvent = function (data) {
                    var message = new azure_iot_device_1.Message(data);
                    this.client.sendEvent(message, this.onResult);
                };
                IotHubClientService.prototype.onConnect = function (err) {
                    if (err) {
                        console.error('Could not connect: ' + err.message);
                    }
                    else {
                        console.log('Client connected');
                        this.connected = true;
                        this.client.on('message', this.onMessage);
                        this.client.on('error', this.onError);
                        this.client.on('disconnect', this.onDisconnect);
                    }
                };
                IotHubClientService.prototype.onError = function (err) {
                    console.error(err.message);
                };
                IotHubClientService.prototype.onMessage = function (message) {
                    console.log('Id: ' + message.messageId + ' Body: ' + message.data);
                    var actionData = message.data;
                    this.client.complete(message, this.onResult);
                };
                IotHubClientService.prototype.onDisconnect = function () {
                    this.connected = false;
                    this.client.removeAllListeners();
                    this.client.open(this.onConnect);
                };
                IotHubClientService.prototype.onResult = function (err, result) {
                    if (err !== undefined) {
                        console.error('error: ' + err.toString());
                    }
                    if (result !== undefined) {
                        console.log('result: ' + result.constructor.name);
                    }
                };
                return IotHubClientService;
            }());
            exports_3("IotHubClientService", IotHubClientService);
        }
    };
});
System.register("main", ["Infrastructure/IotHubClientService"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var IotHubClientService_1, connectionString, client, sendInterval;
    return {
        setters: [
            function (IotHubClientService_1_1) {
                IotHubClientService_1 = IotHubClientService_1_1;
            }
        ],
        execute: function () {
            connectionString = 'HostName=LeGardenHub.azure-devices.net;DeviceId=raspi@legarden;SharedAccessKey=5XXrfzqV9LKrVSY2tuF3eUPImjXkbjAqL3/wbOK6cx4=';
            client = new IotHubClientService_1.IotHubClientService(connectionString);
            sendInterval = setInterval(function () {
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
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9JbmZyYXN0cnVjdHVyZS9JQ2xpZW50U2VydmljZS50cyIsIi4uL3NyYy9Eb21haW4vSUFjdGlvbi50cyIsIi4uL3NyYy9JbmZyYXN0cnVjdHVyZS9Jb3RIdWJDbGllbnRTZXJ2aWNlLnRzIiwiLi4vc3JjL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUVLQTtnQkFLRSw2QkFBWSxnQkFBd0I7b0JBSjdCLGNBQVMsR0FBWSxLQUFLLENBQUM7b0JBS2hDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztvQkFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRyx5QkFBTSxDQUFDLG9CQUFvQixDQUFDLGdCQUFnQixFQUFFLDRCQUFJLENBQUMsQ0FBQztnQkFDcEUsQ0FBQztnQkFFTSxxQ0FBTyxHQUFkO29CQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFFTSx3Q0FBVSxHQUFqQjtvQkFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBRU0sdUNBQVMsR0FBaEIsVUFBaUIsSUFBUztvQkFDeEIsSUFBTSxPQUFPLEdBQUcsSUFBSSwwQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRCxDQUFDO2dCQUVPLHVDQUFTLEdBQWpCLFVBQWtCLEdBQVE7b0JBQ3hCLElBQUksR0FBRyxFQUFFO3dCQUVQLE9BQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUNwRDt5QkFB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