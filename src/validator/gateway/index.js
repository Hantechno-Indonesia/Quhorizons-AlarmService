const { PostGatewayPayloadSchema, PatchGatewayPayloadSchema } = require('./schema')

const GatewayValidator = {
    validatePostGatewayPayload: (payload) => {
        const validationResult = PostGatewayPayloadSchema.validate(payload)
        console.log('validating post payload')
        if (validationResult.error) {
            throw new Error(validationResult.error.message)
        }
    },
    validatePatchGatewayPayload: (payload) => {
        const validationResult = PatchGatewayPayloadSchema.validate(payload)
        console.log('validating patch payload')
        if (validationResult.error) {
            throw new Error(validationResult.error.message)
        }
    }
}

module.exports = GatewayValidator
