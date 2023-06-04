const { PostRecordPayloadSchema, GetDeviceRecordsByFilterPayloadSchema } = require('./schema')

const RecordValidator = {
    validatePostRecordPayload: (payload) => {
        const validationResult = PostRecordPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new Error(validationResult.error.message)
        }
    },
    validateGetDeviceRecordsByFilterPayload: (payload) => {
        const validationResult = GetDeviceRecordsByFilterPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new Error(validationResult.error.message)
        }
    }

}

module.exports = RecordValidator
