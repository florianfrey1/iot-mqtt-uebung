import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export default class Database {
    static #instance
    static async getInstance() {
        if (!Database.#instance)
            Database.#instance = await open({
                filename: './database.db',
                driver: sqlite3.Database
            })

        return Database.#instance
    }
}