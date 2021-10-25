const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com', {
    clientId: Date.now().toString(36)
})

client.on('connect', function () {
    client.publish('iotcourse/test-channel', 'test message', { retain: true })
})