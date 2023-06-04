class ClientError extends Error {
    constructor (message, statusCode = 400, pcode = 1) {
        super(message)
        this.statusCode = statusCode
        this.name = 'ClientError'
        this.pcode = pcode
    }
}

module.exports = ClientError
