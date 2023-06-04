const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RecordSchema = new Schema({
    deviceUUID: {
        type: mongoose.ObjectId,
        required: true
    },
    companyUid: {
        type: String,
        required: true
    },
    deviceUid: {
        type: String,
        required: true
    },
    deviceMacId: {
        type: String,
        required: true
    },
    sensorValues: {
        temp: {
            type: Number,
            require: false
        },
        hum: {
            type: Number,
            require: false
        }
    },
    time: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('record', RecordSchema)
