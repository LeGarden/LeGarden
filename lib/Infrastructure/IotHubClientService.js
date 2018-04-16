"use strict";
exports.__esModule = true;
var azure_iot_device_1 = require("azure-iot-device");
var azure_iot_device_mqtt_1 = require("azure-iot-device-mqtt");
var IotHubClientService = (function () {
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
    ;
    IotHubClientService.prototype.onDisconnect = function () {
        this.connected = false;
        this.client.removeAllListeners();
        this.client.open(this.onConnect);
    };
    ;
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
exports.IotHubClientService = IotHubClientService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW90SHViQ2xpZW50U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9JbmZyYXN0cnVjdHVyZS9Jb3RIdWJDbGllbnRTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQW1EO0FBQ25ELCtEQUE2QztBQUk3QztJQUtJLDZCQUFZLGdCQUF3QjtRQUo3QixjQUFTLEdBQVksS0FBSyxDQUFDO1FBSzlCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLHlCQUFNLENBQUMsb0JBQW9CLENBQUMsZ0JBQWdCLEVBQUUsNEJBQUksQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFTSxxQ0FBTyxHQUFkO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFTSx3Q0FBVSxHQUFqQjtRQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBRU0sdUNBQVMsR0FBaEIsVUFBaUIsSUFBUztRQUN0QixJQUFNLE9BQU8sR0FBRyxJQUFJLDBCQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU8sdUNBQVMsR0FBakIsVUFBa0IsR0FBUTtRQUN0QixJQUFHLEdBQUcsRUFBRTtZQUVKLE9BQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3REO2FBQU07WUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDbkQ7SUFDTCxDQUFDO0lBRU8scUNBQU8sR0FBZixVQUFnQixHQUFRO1FBRXBCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTyx1Q0FBUyxHQUFqQixVQUFrQixPQUFnQjtRQUU5QixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkUsSUFBTSxVQUFVLEdBQVksT0FBTyxDQUFDLElBQUksQ0FBQztRQUl6QyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFBQSxDQUFDO0lBRU0sMENBQVksR0FBcEI7UUFDSSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFBQSxDQUFDO0lBRU0sc0NBQVEsR0FBaEIsVUFBaUIsR0FBUSxFQUFFLE1BQVc7UUFDbEMsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1lBRW5CLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQzdDO1FBQ0QsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO1lBRXRCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckQ7SUFDTCxDQUFDO0lBQ0wsMEJBQUM7QUFBRCxDQUFDLEFBcEVELElBb0VDO0FBcEVZLGtEQUFtQiJ9