const ServerError = require('./ServerError')

class DBDeleteError extends ServerError {
    constructor (message, statusCode = 500, extra = null) {
        super(message)
        this.statusCode = statusCode
        this.name = 'DBDeleteError'
        this.extra = extra
    }
}

module.exports = DBDeleteError
