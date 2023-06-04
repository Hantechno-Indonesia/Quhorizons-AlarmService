class DeviceFlag {
    constructor (model) {
        this._model = model
    }

    async getDeviceFlageByDeviceMacId (companyUid, deviceMacId) {
        try {
            const deviceFlag = this._model.findOne({ companyUid, deviceMacId })
            return deviceFlag
        } catch (err) {
            console.log('failed fetch deviceflage', err)
            return null
        }
    }

    async getByCompany (companyUid) {
        try {
            const deviceFlags = this._model.find({ companyUid: companyUid, alarmTimeStart: { $ne: null } })
            return deviceFlags
        } catch (err) {
            console.log('failed fetch deviceflags', err)
            return null
        }
    }

    async createNewFlag (companyUid, inventoryUid, deviceMacId, data) {
        const source = { companyUid, inventoryUid, deviceMacId, ...data }
        try {
            const deviceFlag = new this._model(source)
            const newFlag = await deviceFlag.save(function (err, res) {
                if (err) throw err
            })
            return newFlag
        } catch (err) {
            console.log('failed fetch deviceflage', err)
            return null
        }
    }

    async updateNewFlag (companyUid, inventoryUid, deviceMacId, data) {
        const filter = { companyUid, inventoryUid, deviceMacId }
        try {
            const update = this._model.updateOne(filter, {
                alarmTimeStart: data.alarmTimeEnd == null ? data.alarmTimeStart : null,
                alertTimeStart: data.alertTimeEnd == null ? data.alertTimeStart : null
            })
            return update
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = DeviceFlag
