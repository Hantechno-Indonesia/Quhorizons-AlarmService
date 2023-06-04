const Joi = require('joi')

const PostDevicePayloadSchema = Joi.object({
    companyId: Joi.number(),
    companyUid: Joi.string().required(),
    warehouseId: Joi.number(),
    warehouseUid: Joi.string(),
    inventoryId: Joi.number(),
    inventoryUid: Joi.string(),
    gatewayUid: Joi.string().required(),
    gatewayMacId: Joi.string().required(),
    deviceId: Joi.number(),
    deviceUid: Joi.string().required(),
    deviceMacId: Joi.string().required(),
    deviceName: Joi.string().required(),
    tempMacId: Joi.string().required(),
    humMacId: Joi.string().required(),
    vendor: Joi.string().required(),
    extra: Joi.string()
})

const DeleteDeviceParamsSchema = Joi.object({
    companyUid: Joi.string().required(),
    deviceUid: Joi.string().required()
})

module.exports = { PostDevicePayloadSchema, DeleteDeviceParamsSchema }
