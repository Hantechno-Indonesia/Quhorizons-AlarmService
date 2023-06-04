const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlarmSchema = new Schema({
    companyUid: {
        type: String,
        required: true
    },
    inventoryUid: {
        type: String,
        required: false
    },
    inventoryNumber: {
        type: String,
        required: false
    },
    extra: {
        type: String,
        required: false
    },
    alarmTempUpper: {
        type: Number,
        required: false
    },
    alarmTempLower: {
        type: Number,
        required: false
    },
    alarmHumUpper: {
        type: Number,
        required: false
    },
    alarmHumLower: {
        type: Number,
        required: false
    },
    alertTempUpper: {
        type: Number,
        required: false
    },
    alertTempLower: {
        type: Number,
        required: false
    },
    alertHumUpper: {
        type: Number,
        required: false
    },
    alertHumLower: {
        type: Number,
        required: false
    },
    alarmTimeStart: {
        type: Number,
        required: false
    },
    alertTimeStart: {
        type: Number,
        required: false
    }
})

AlarmSchema.indexes([
    {
        inventoryUid: 1
    },
    {
        companyUid: 1, inventoryUid: 1
    }
])

module.exports = mongoose.model('alarm', AlarmSchema)
