import mysql from 'mysql'

export default class Database {
    #connection
    constructor(host, user, password, database) {
        return new Promise((res, rej) => {
            this.#connection = mysql.createConnection({
                host: host,
                user: user,
                password: password,
                database: database
            })

            this.#connection.connect(err => {
                if (err)
                    rej(err)

                res(this)
            })
        })
    }
    query(sql) {
        return new Promise((res, rej) => {
            this.#connection.query(sql, (err, result) => {
                if (err)
                    rej(err)

                res(result)
            })
        })
    }
}