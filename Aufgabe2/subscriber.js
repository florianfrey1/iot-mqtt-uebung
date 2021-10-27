import mqtt from 'mqtt'
const client = mqtt.connect('mqtt://broker.hivemq.com', {
    clientId: 'ad49cd66d5f7fb0c8c7c1337173d7719',
    clean: false
})
import Database from './database.js'
const database = await Database.getInstance()
const rgxIsoTimestamp = /^(?<date>.*)T(?<time>.*)\.(?<milliseconds>.*)Z.*$/
const getTimestampFromDate = date => {
    const matchDate = date.toISOString().match(rgxIsoTimestamp)
    return `${matchDate.groups.date} ${matchDate.groups.time}.${matchDate.groups.milliseconds}`
}
const getTimeFromDate = date => {
    const matchDate = date.toISOString().match(rgxIsoTimestamp)
    return `${matchDate.groups.time}.${matchDate.groups.milliseconds}`
}

await database.exec(`CREATE TABLE IF NOT EXISTS measurements (
    ts_in TEXT,
    ts_meas TEXT,
    id TEXT,
    battery REAL,
    temp REAL,
    memtotal_mb REAL,
    memavailable_mb REAL,
    load REAL,
    ts_diff TEXT
)`)
await database.exec(`DELETE FROM measurements;`)

client.on('connect', function () {
    // iotcourse/T3INF4902
    client.subscribe('iotcourse/internetderdingse42', { qos: 1 })
})

client.on('message', async (topic, message, options) => {
    console.log(`[${topic}] ${message.toString()} [retain: ${options.retain}, qos: ${options.qos}]`)
    message = JSON.parse(message)
    
    const dateIn = new Date()
    const dateMeas = new Date(message.ts_meas)
    const dateDifference = dateIn - dateMeas
    const tsDifference = getTimeFromDate(new Date(dateDifference))
    const tsIn = getTimestampFromDate(dateIn)
    const tsMeas = getTimestampFromDate(new Date(message.ts_meas))

    const insertStatement = `INSERT INTO measurements (ts_in, ts_meas, id, battery, temp, memtotal_mb, memavailable_mb, load, ts_diff)
    VALUES ('${tsIn}', '${tsMeas}', '${message.id}', ${message.battery}, ${message.temp}, ${message.memtotal}, ${message.memavailable}, ${message.load}, '${tsDifference}')`

    const result = await database.run(insertStatement)
})