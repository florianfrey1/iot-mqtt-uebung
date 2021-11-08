import mqtt from 'mqtt'
import Database from './database.js'
import DateTime from './datetime.js'

const client = mqtt.connect('mqtt://broker.hivemq.com', {
    clientId: 'ad49cd66d5f7fb0c8c7c1337173d7719',
    clean: false
})
const database = await new Database('localhost', 'root', '12345678', 'mysql')

await database.query(
    `CREATE TABLE IF NOT EXISTS measurements (
            ts_in DATETIME,
            payload JSON
        )`
)

client.on('connect', () => {
    client.subscribe('iotcourse/T3INF4902', { qos: 1 })
})

client.on('message', async (topic, message, options) => {
    console.log(`[${topic}] ${message.toString()} [retain: ${options.retain}, qos: ${options.qos}]`)

    await database.query(`INSERT INTO measurements (ts_in, payload)
        VALUES ('${DateTime.fromDate(new Date())}', '${message}')`)
})