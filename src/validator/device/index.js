const { PostDevicePayloadSchema, DeleteDeviceParamsSchema } = require('./schema')

const DeviceValidator = {
    validatePostDevicePayload: (payload) => {
        const validationResult = PostDevicePayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new Error(validationResult.error.message)
        }
    },

    validateDeleteDeviceParams: (params) => {
        const validationResult = DeleteDeviceParamsSchema.validate(params)
        if (validationResult.error) {
            throw new Error(validationResult.error.message)
        }
    }
}

module.exports = DeviceValidator
