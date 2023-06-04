
class AlarmHandler {
    constructor (service, validator) {
        const { alarmService, notificationService, deviceFlagService, mailerService } = service
        this._service = alarmService
        this._notificationService = notificationService
        this._deviceFlagService = deviceFlagService
        this._mailerService = mailerService
        this._validator = validator

        this.postAlarmHandler = this.postAlarmHandler.bind(this)
        this.patchAlarmByInventoryUidHandler = this.patchAlarmByInventoryUidHandler.bind(this)
        this.deleteAlarmByInventoryUidHandler = this.deleteAlarmByInventoryUidHandler.bind(this)
        this.getAllAlarmByCompanyUidHandler = this.getAllAlarmByCompanyUidHandler.bind(this)
        this.getAlarmByCompanyInventoryUidHandler = this.getAlarmByCompanyInventoryUidHandler.bind(this)
        this.postCheckMeasurementHandler = this.postCheckMeasurementHandler.bind(this)
        this.getAllSensorInAlarmHandler = this.getAllSensorInAlarmHandler.bind(this)
    }

    async postAlarmHandler (request, h) {
        console.log('creating alarm')
        try {
            this._validator.validatePostAlarmPayload(request.payload)

            const insert = await this._service.addAlarm(request.payload)

            console.log('finish creating alarm', insert)
            const response = h.response({
                status: 'success',
                message: 'alarm has been saved',
                data: insert
            })

            response.code(200)
            return response
        } catch (error) {
            console.log(error)
            const response = h.response({
                status: 'fail',
                message: error.message
            })

            response.code(400)
            return response
        }
    }

    async patchAlarmByInventoryUidHandler (request, h) {
        try {
            console.log(request.payload)
            this._validator.validatePatchAlarmPayload(request.payload)
            const { companyUid, inventoryUid } = request.params

            const update = await this._service.updateAlarm(companyUid, inventoryUid, request.payload)

            if (update.n === 0) {
                throw new Error('Alarm not found')
            } else if (update.ok === 0) {
                throw new Error('Alarm Failed to update')
            }

            const response = h.response({
                status: 'success',
                message: 'alarm has been updated',
                data: update
            })

            response.code(200)
            return response
        } catch (error) {
            console.log(error)
            const response = h.response({
                status: 'fail',
                message: error.message
            })

            response.code(400)
            return response
        }
    }

    async deleteAlarmByInventoryUidHandler (request, h) {
        try {
            const { companyUid, inventoryUid } = request.params
            console.log("delelte", companyUid, inventoryUid)
            const update = await this._service.deleteAlarm(companyUid, inventoryUid)
            console.log("delete", update)
            if (update.ok !== 1) {
                const response = h.response({
                    status: 'failed',
                    message: 'fail to delete alarm',
                    data: update
                })
                response.code(200)
            } else if (update.deletedCount === 0) {
                const response = h.response({
                    status: 'success',
                    message: 'alarm has been deleted',
                    data: update
                })

                response.code(200)
            }
            return response
        } catch (error) {
            console.log(error)
            const response = h.response({
                status: 'fail',
                message: error.message
            })

            response.code(400)
            return response
        }
    }

    async getAllAlarmByCompanyUidHandler (request, h) {
        try {
            const { companyUid } = request.params

            const alarms = await this._service.getAlarmByCompanyUid(companyUid)

            const response = h.response({
                status: 'success',
                data: alarms
            })

            response.code(200)
            return response
        } catch (error) {
            console.log(error)
            const response = h.response({
                status: 'fail',
                message: error.message
            })

            response.code(400)
            return response
        }
    }

    async getAlarmByCompanyInventoryUidHandler (request, h) {
        try {
            const { companyUid, inventoryUid } = request.params

            const alarms = await this._service.getAlarmByCompanyInventoryUid(companyUid, inventoryUid)
            // console.log(alarms)
            let result = null
            if (alarms !== null) {
                result = {
                    alarmHumLower: alarms.alarmHumLower,
                    alarmHumUpper: alarms.alarmHumUpper,
                    alarmTempLower: alarms.alarmTempLower,
                    alarmTempUpper: alarms.alarmTempUpper,
                    alertHumLower: alarms.alertHumLower,
                    alertHumUpper: alarms.alertHumUpper,
                    alertTempLower: alarms.alertTempLower,
                    alertTempUpper: alarms.alertTempUpper
                }
            }

            console.log('result alarm by inventoryUid', alarms)

            const response = h.response({
                status: 'success',
                data: result
            })

            response.code(200)
            return response
        } catch (error) {
            console.log(error)
            const response = h.response({
                status: 'fail',
                message: error.message
            })

            response.code(400)
            return response
        }
    }

    async postCheckMeasurementHandler (request, h) {
        try {
            // console.log(request.payload)
            this._validator.validatePostCheckMeasurementPayload(request.payload)

            // console.log('REQUEST ', request.payload)

            const { companyUid, inventoryUid, deviceMacId, deviceName } = request.payload

            const alarm = await this._service.getByCompanyInventoryUid(companyUid, inventoryUid)

            // console.log("Criteria",companyUid, inventoryUid, alarm)

            if (alarm === null) {
                throw new Error('alarm not found')
            }

            // get device
            let deviceFlag = await this._deviceFlagService.getDeviceFlageByDeviceMacId(companyUid, deviceMacId)
            deviceFlag = deviceFlag === null ? {} : deviceFlag
            const check = await this._service.checkMeasurement(alarm, deviceFlag, request.payload)
            // console.log('check')
            // // // save to alarm db
            let dFlag = null
            if (Object.keys(deviceFlag).length === 0) {
                dFlag = await this._deviceFlagService.createNewFlag(companyUid, inventoryUid, deviceMacId, check)
            } else {
                dFlag = await this._deviceFlagService.updateNewFlag(companyUid, inventoryUid, deviceMacId, check)
            }

            // // save to notification
            // console.log("ALARM", alarm)
            const notif = await this._notificationService.generateNotification(alarm, deviceMacId, deviceName, check)

            const emailNotif = await this._mailerService.generateMailNotification(alarm, deviceMacId, deviceName, check)
            // console.log(emailNotif)

            const response = h.response({
                status: 'success',
                data: { check, dFlag, notif }
            })

            response.code(200)
            return response
        } catch (error) {
            console.log(error)
            const response = h.response({
                status: 'fail',
                message: error.message
            })

            response.code(400)
            return response
        }
    }

    async getAllSensorInAlarmHandler (request, h) {
        const { companyUid } = request.params

        const deviceFlags = await this._deviceFlagService.getByCompany(companyUid)

        const response = h.response({
            status: 'success',
            data: deviceFlags.length
        })

        response.code(200)
        return response
    }

}

module.exports = AlarmHandler
