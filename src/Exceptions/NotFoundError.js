const ClientError = require('./ClientError')

class NotFoundError extends ClientError {
    constructor (message, statusCode = 404, layer = 'server', pcode = 2) {
        super(message)
        this.name = 'NotFoundException'
        this.message = message
        this.statusCode = statusCode
        this.layer = layer
        this.pcode = pcode
    }
}

module.exports = NotFoundError
