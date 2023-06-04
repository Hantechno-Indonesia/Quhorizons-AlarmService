const { PostAlarmPayloadSchema, PatchAlarmPayloadSchema, PostCheckMeasurementPayloadSchema } = require('./schema')

const AlarmValidator = {
    validatePostAlarmPayload: (payload) => {
        const validationResult = PostAlarmPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new Error(validationResult.error.message)
        }
    },
    validatePatchAlarmPayload: (payload) => {
        const validationResult = PatchAlarmPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new Error(validationResult.error.message)
        }
    },
    validatePostCheckMeasurementPayload: (payload) => {
        const validationResult = PostCheckMeasurementPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new Error(validationResult.error.message)
        }
    }
}

module.exports = AlarmValidator
