const Joi = require('joi')

const PostGatewayPayloadSchema = Joi.object({
    companyId: Joi.number(),
    companyUid: Joi.string().required(),
    warehouseId: Joi.number(),
    warehouseUid: Joi.string(),
    inventoryId: Joi.number(),
    inventoryUid: Joi.string(),
    gatewayId: Joi.number(),
    gatewayUid: Joi.string().required(),
    gatewayMacId: Joi.string().required(),
    extra: Joi.string()
})

const PatchGatewayPayloadSchema = Joi.object({
    gatewayMacId: Joi.string().required()
})

module.exports = { PostGatewayPayloadSchema, PatchGatewayPayloadSchema }
