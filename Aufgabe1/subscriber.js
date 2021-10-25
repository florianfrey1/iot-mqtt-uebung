const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com', {
    clientId: Date.now().toString(36)
})

client.on('connect', function () {
    client.subscribe('iotcourse/test-channel')
})

client.on('message', function (topic, message, options) {
    console.log(`${topic}: ${message.toString()} [retain: ${options.retain}, qos: ${options.qos}]`)
})