const Joi = require('joi')

const PostAlarmPayloadSchema = Joi.object({
    companyUid: Joi.string().required(),
    inventoryUid: Joi.string().required(),
    inventoryNumber: Joi.required(),
    extra: Joi.string(),
    alarmTempUpper: Joi.number().allow(null),
    alarmTempLower: Joi.number().allow(null),
    alarmHumUpper: Joi.number().allow(null),
    alarmHumLower: Joi.number().allow(null),
    alertTempUpper: Joi.number().allow(null),
    alertTempLower: Joi.number().allow(null),
    alertHumUpper: Joi.number().allow(null),
    alertHumLower: Joi.number().allow(null),
    alarmTimeStart: Joi.number().allow(null),
    alertTimeStart: Joi.number().allow(null)
})

const PatchAlarmPayloadSchema = Joi.object({
    extra: Joi.string(),
    alarmTempUpper: Joi.number().allow(null),
    alarmTempLower: Joi.number().allow(null),
    alarmHumUpper: Joi.number().allow(null),
    alarmHumLower: Joi.number().allow(null),
    alertTempUpper: Joi.number().allow(null),
    alertTempLower: Joi.number().allow(null),
    alertHumUpper: Joi.number().allow(null),
    alertHumLower: Joi.number().allow(null),
    alarmTimeStart: Joi.number().allow(null),
    alertTimeStart: Joi.number().allow(null)
})

const PostCheckMeasurementPayloadSchema = Joi.object({
    companyUid: Joi.string().required(),
    inventoryUid: Joi.string().required(),
    deviceUid: Joi.string().required(),
    deviceMacId: Joi.string().required(),
    deviceName: Joi.string().required(),
    tempVal: Joi.number().allow(null),
    humVal: Joi.number().allow(null),
    time: Joi.string().length(13).required()
})

module.exports = { PostAlarmPayloadSchema, PatchAlarmPayloadSchema, PostCheckMeasurementPayloadSchema }
