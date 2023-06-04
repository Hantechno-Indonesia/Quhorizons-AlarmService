// const DeviceModel = require('./../Models/device')
const _ = require('lodash')

class DeviceService {
    constructor (model) {
        this._model = model
    }

    async addDevice (data) {
        try {
            const device = new this._model(data)
            const deviceCount = await this.getByDeviceMacOrUid(data.deviceUid, device.deviceMacId)

            if (deviceCount > 0) throw new Error('Device / Mac already exists')

            const result = await device.save(function (err, res) {
                if (err) throw err
            })
            return result
        } catch (error) {
            throw new Error(error)
        }
    }

    async getByDeviceMacOrUid (uid, mac) {
        try {
            const deviceCount = await this._model.countDocuments({ $or: [{ deviceUid: uid }, { deviceMacId: mac }] })
            return deviceCount
        } catch (error) {
            throw new Error(error)
        }
    }

    async removeDeviceByCompanyDeviceUid (companyUid, deviceUid) {
        console.log('deleting', companyUid, deviceUid)
        const result = await this._model.deleteOne({
            companyUid: companyUid, deviceUid: deviceUid
        })
        return result
    }

    async updateDeviceByCompanyDeviceUid (companyUid, deviceUid, data) {
        try {
            const device = await this._model.updateOne({
                companyUid: companyUid, deviceUid: deviceUid
            }, data, function (err, res) {
                if (err) throw new Error(err)
            })

            return device
        } catch (error) {
            throw new Error(error)
        }
    }

    async getDeviceByDeviceMacId (deviceMacId, vendor) {
        try {
            if (vendor.toLowerCase() === 'akcp') {
                const device = await this._model.findOne({ $or: [{ tempMacId: deviceMacId }, { humMacId: deviceMacId }] })
                return device
            } else if (vendor.toLowerCase() === 'tzone') {
                const device = await this._model.findOne({ deviceMacId: deviceMacId })
                return device
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    async getDeviceByCompanyUid (companyUid) {
        try {
            const devices = await this._model.find({ companyUid: companyUid }).exec()
            return devices
        } catch (error) {
            console.log('error fetching device by companyUid', error)
            return []
        }
    }

    async getDeviceByCompanyInventoryUid (companyUid, inventoryUid) {
        try {
            const devices = await this._model.find({ companyUid: companyUid, inventoryUid: inventoryUid }).exec()
            return devices
        } catch (error) {
            console.log('error fetching device by companyUid', error)
            return []
        }
    }

    generateFineStatus (deviceInfos, records, periodInSeconds = 60) {
        const grouped = _.groupBy(records, 'deviceUUID')
        for (const gridx in grouped) {
            grouped[gridx] = _.sortBy(grouped[gridx], 'time')
        }

        const fineStatus = deviceInfos.map(di => {
            const meta = {
                deviceUUID: di.deviceUUID,
                inventoryUid: di.inventoryUid,
                deviceUid: di.deviceUid,
                deviceMacId: di.deviceMacId,
                deviceVendor: di.vendor
            }
            if (typeof grouped[di._id] !== 'undefined') {
                const record = grouped[di._id][grouped[di._id].length - 1]
                let tempVal = null
                let humVal = null
                for (const rec of grouped[di._id]) {
                    if (rec.sensorValues.temp !== null) {
                        tempVal = rec.sensorValues.temp
                    }

                    if (rec.sensorValues.hum !== null) {
                        humVal = rec.sensorValues.hum
                    }
                }
                // return []
                return {
                    ...meta,
                    time: record.time,
                    tempVal: tempVal,
                    humVal: humVal,
                    isOnline: record.time > (Date.now() - (periodInSeconds * 1000))
                }
            } else {
                return {
                    ...meta,
                    isOnline: false
                }
            }
        })
        return fineStatus
    }

    async getDevicesByGatewayMacIds (gatewayMacIds) {
        try {
            const devices = this._model.find({ gatewayMacId: { $in: gatewayMacIds } }).exec()
            return devices
        } catch (error) {
            console.log('Error fetching devices by gateway mac ids', error)
            return []
        }
    }
}

module.exports = DeviceService
