const ClientError = require('./ClientError')

class NotFoundError extends ClientError {
    constructor (message, statusCode = 400, layer = 'server', pcode = 1) {
        super(message)
        this.name = 'NotFoundError'
        this.message = message
        this.statusCode = statusCode
        this.layer = layer
    }
}

module.exports = NotFoundError
