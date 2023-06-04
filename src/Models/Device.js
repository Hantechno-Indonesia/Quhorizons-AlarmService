const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeviceSchema = new Schema({
    companyId: {
        type: Number,
        required: false
    },
    companyUid: {
        type: String,
        required: true
    },
    warehouseId: {
        type: Number,
        required: false
    },
    warehouseUid: {
        type: String,
        required: false
    },
    inventoryId: {
        type: Number,
        required: false
    },
    inventoryUid: {
        type: String,
        required: false
    },
    gatewayUid: {
        type: String,
        required: true
    },
    gatewayMacId: {
        type: String,
        required: true
    },
    deviceId: {
        type: Number,
        required: false
    },
    deviceUid: {
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
    tempMacId: {
        type: String,
        required: true
    },
    humMacId: {
        type: String,
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    extra: {
        type: String,
        required: false
    },
    lastTemp: {
        type: Number,
        required: false
    },
    lastHum: {
        type: Number,
        required: false
    },
    lastRecord: {
        type: Number,
        required: false
    }
})

DeviceSchema.indexes([
    {
        temp_mac_id: 1
    },
    {
        hum_mac_id: 1
    },
    {
        company_id: 1, device_uid: 1
    }
])

module.exports = mongoose.model('device', DeviceSchema)
