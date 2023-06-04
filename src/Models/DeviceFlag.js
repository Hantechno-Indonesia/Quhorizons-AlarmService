const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlarmSchema = new Schema({
    companyUid: {
        type: String,
        required: true
    },
    inventoryUid: {
        type: String,
        required: true
    },
    deviceMacId: {
        type: String,
        required: true
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
        deviceMacid: 1
    },
    {
        companyUid: 1, inventoryUid: 1
    }
])

module.exports = mongoose.model('deviceFlag', AlarmSchema)
