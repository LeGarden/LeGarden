"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.IotHubClientService = IotHubClientService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW90SHViQ2xpZW50U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9JbmZyYXN0cnVjdHVyZS9Jb3RIdWJDbGllbnRTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQW1EO0FBQ25ELCtEQUE2QztBQUk3QztJQUtFLDZCQUFZLGdCQUF3QjtRQUo3QixjQUFTLEdBQVksS0FBSyxDQUFDO1FBS2hDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLHlCQUFNLENBQUMsb0JBQW9CLENBQUMsZ0JBQWdCLEVBQUUsNEJBQUksQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFTSxxQ0FBTyxHQUFkO1FBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFTSx3Q0FBVSxHQUFqQjtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU0sdUNBQVMsR0FBaEIsVUFBaUIsSUFBUztRQUN4QixJQUFNLE9BQU8sR0FBRyxJQUFJLDBCQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU8sdUNBQVMsR0FBakIsVUFBa0IsR0FBUTtRQUN4QixJQUFJLEdBQUcsRUFBRTtZQUVQLE9BQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3BEO2FBQU07WUFFTCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDakQ7SUFDSCxDQUFDO0lBRU8scUNBQU8sR0FBZixVQUFnQixHQUFRO1FBRXRCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFTyx1Q0FBUyxHQUFqQixVQUFrQixPQUFnQjtRQUVoQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkUsSUFBTSxVQUFVLEdBQVksT0FBTyxDQUFDLElBQUksQ0FBQztRQUl6QyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTywwQ0FBWSxHQUFwQjtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVPLHNDQUFRLEdBQWhCLFVBQWlCLEdBQVEsRUFBRSxNQUFXO1FBQ3BDLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtZQUVyQixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUMzQztRQUNELElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUV4QixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25EO0lBQ0gsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQXBFRCxJQW9FQztBQXBFWSxrREFBbUIifQ==