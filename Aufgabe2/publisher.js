import mqtt from 'mqtt'
import batteryLevel from 'battery-level'
import osUtils from 'node-os-utils'
const clientId = Date.now().toString(36)
const client = mqtt.connect('mqtt://broker.hivemq.com', {
    clientId: clientId,
    clean: false
})

client.on('connect', async () => {
    setInterval(async () => {
        const currentBatteryLevel = await batteryLevel() * 100
        const cpuUsage = await osUtils.cpu.usage()
        const memory = await osUtils.mem.free()

        // iotcourse/T3INF4902
        client.publish('iotcourse/internetderdingse42', JSON.stringify({
            'ts_meas': (new Date()).toISOString(),
            'id': clientId,
            'temp': Math.random().toFixed(4),
            'battery': currentBatteryLevel,
            'load': cpuUsage,
            'memtotal': memory.totalMemMb,
            'memavailable': memory.freeMemMb
        }), { qos: 1 })
    }, 5e3)
})