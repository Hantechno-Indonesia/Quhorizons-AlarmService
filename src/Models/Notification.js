const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
    companyUid: {
        type: String,
        required: true
    },
    inventoryUid: {
        type: String,
        required: true
    },
    inventoryNumber: {
        type: String,
        required: true
    },
    deviceMacId: {
        type: String,
        required: true
    },
    deviceName: {
        type: String,
        required: true
    },
    violations: {
        type: Array,
        required: true
    },
    extra: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    tempVal: {
        type: Number,
        required: false
    },
    humVal: {
        type: Number,
        required: false
    },
    startTime: {
        type: Number,
        required: false
    },
    endTime: {
        type: Number,
        required: false
    },
    ack: {
        type: Number,
        required: false
    },
    alarmCriteria: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false
    },
})

NotificationSchema.indexes([
    {
        inventoryUid: 1
    },
    {
        companyUid: 1, inventoryUid: 1
    }
])

module.exports = mongoose.model('notification', NotificationSchema)
