const Joi = require('joi')

const PostRecordPayloadSchema = Joi.object({
    timestamp: Joi.required(),
    deviceMacId: Joi.string().required(),
    deviceName: Joi.string().required(),
    val: Joi.array().items(Joi.number()).length(3),
    vendor: Joi.string().required(),
    extra: Joi.string(),
    gwId: Joi.string()
})

const GetDeviceRecordsByFilterPayloadSchema = Joi.object({
    // companyUid: Joi.string().required(),
    // deviceUid: Joi.string().required(),
    startTs: Joi.string().min(13).required(),
    endTs: Joi.string().min(13).required()
})

module.exports = { PostRecordPayloadSchema, GetDeviceRecordsByFilterPayloadSchema }
