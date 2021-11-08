export default class DateTime {
    static #rgxIsoTimestamp = /^(?<date>.*)T(?<time>.*)\.(?<milliseconds>.*)Z.*$/
    static fromDate(date) {
        const matchDate = date.toISOString().match(DateTime.#rgxIsoTimestamp)
        return `${matchDate.groups.date} ${matchDate.groups.time}`
    }
}