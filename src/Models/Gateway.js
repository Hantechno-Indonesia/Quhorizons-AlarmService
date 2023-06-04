const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GatewaySchema = new Schema({
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
    gatewayId: {
        type: Number,
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
    vendor: {
        type: String,
        required: false
    },
    extra: {
        type: String,
        required: false
    }
})

GatewaySchema.indexes([
    {
        gatewayMacId: 1
    },
    {
        companyUid: 1, deviceUid: 1
    }
])

module.exports = mongoose.model('gateway', GatewaySchema)
