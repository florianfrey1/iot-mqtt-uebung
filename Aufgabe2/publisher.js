import mqtt from 'mqtt'
import batteryLevel from 'battery-level'
import osUtils from 'node-os-utils'
import DateTime from './datetime.js'

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

        client.publish('iotcourse/T3INF4902', JSON.stringify({
            'ts_meas': DateTime.fromDate(new Date()),
            'id': clientId,
            'temp': Math.random().toFixed(4),
            'battery': currentBatteryLevel,
            'load': cpuUsage,
            'memtotal': memory.totalMemMb,
            'memavailable': memory.freeMemMb
        }), { qos: 1 })
    }, 5e3)
})