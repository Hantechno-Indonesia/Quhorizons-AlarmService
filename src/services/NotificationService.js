const mongoose = require('mongoose')
// const DeviceModel = require('./../Models/device')
// const _ = require('lodash')

class NotificationService {
    constructor (model) {
        const { NotificationModel } = model
        this._model = NotificationModel
    }

    async generateNotification (alarmCriteria, deviceMacId, deviceName, check) {
        // create new notification if new trigger accur (trigger accur and endTime provided)
        // console.log('notif', deviceMacId, deviceName)
        // console.log('checkTIme', check.alertTimeStart)
        for (const action of check.actions) {
            switch (action) {
            case 'new-alert': this.createNewAlert(alarmCriteria, deviceMacId, deviceName, check)
                break
            case 'new-alarm': this.createNewAlarm(alarmCriteria, deviceMacId, deviceName, check)
                break
            case 'end-alert': this.endAlert(alarmCriteria, deviceMacId, check)
                break
            case 'end-alarm': this.endAlarm(alarmCriteria, deviceMacId, check)
                break
            }
        }

        // update notification if endTime provided but trigger not accur
    }

    async createNewAlert (alarmCriteria, deviceMacId, deviceName, data) {
        const { companyUid, inventoryUid } = alarmCriteria
        console.log('create new alert', alarmCriteria.inventoryNumber)
        const d = {
            companyUid: companyUid,
            inventoryUid: inventoryUid,
            inventoryNumber: alarmCriteria.inventoryNumber,
            type: 'alert',
            deviceMacId: deviceMacId,
            deviceName: deviceName,
            message: JSON.stringify(data.message),
            violations: [data.tempViolation, data.humViolation],
            tempVal: data.tempVal,
            humVal: data.humVal,
            startTime: data.alertTimeStart,
            endTime: null,
            ack: null,
            alarmCriteria: JSON.stringify(alarmCriteria)
        }
        console.log('new ', d)
        const notif = new this._model(d)

        try {
            const result = await notif.save(function (err, res) {
                if (err) throw err
                console.log('res', res)
            })
            return result
        } catch (error) {
            console.log('failed saving notification')
            throw new Error(error)
        }
    }

    async createNewAlarm (alarmCriteria, deviceMacId, deviceName, data) {
        console.log('create new alarm', data)
        const { companyUid, inventoryUid } = alarmCriteria
        const d = {
            companyUid: companyUid,
            inventoryUid: inventoryUid,
            inventoryNumber: alarmCriteria.inventoryNumber,
            type: 'alarm',
            deviceMacId: deviceMacId,
            deviceName: deviceName,
            message: JSON.stringify(data.message),
            violations: [data.tempViolation, data.humViolation],
            tempVal: data.tempVal,
            humVal: data.humVal,
            startTime: data.alarmTimeStart,
            endTime: null,
            ack: null,
            alarmCriteria: JSON.stringify(alarmCriteria)
        }
        // console.log('new  ', d)
        const notif = new this._model(d)

        try {
            const result = await notif.save(function (err, res) {
                if (err) throw err
                console.log('res', res)
            })
            return result
        } catch (error) {
            throw new Error(error)
        }
    }

    async endAlert (alarmCriteria, deviceMacId, data) {
        // const notif = this._model.findOne({ companyUid: companyUid, inventoryUid: inventoryUid, startTime: data.alertTimeStart })
        // console.log('end alert', data.alertTimeEnd)
        const { companyUid, inventoryUid } = alarmCriteria
        try {
            const update = await this._model.updateOne({ companyUid: companyUid, inventoryUid: inventoryUid, deviceMacId: deviceMacId, startTime: data.alertTimeStart },
                { endTime: data.alertTimeEnd },
                function (err, res) {
                    if (err) throw err
                    console.log('filter', { companyUid: companyUid, inventoryUid: inventoryUid, startTime: data.alertTimeStart }, res)
                })

            return update
        } catch (error) {
            throw new Error(error)
        }
    }

    async endAlarm (alarmCriteria, deviceMacId, data) {
        console.log('end-alarm')
        const { companyUid, inventoryUid } = alarmCriteria
        // const notif = this._model.findOne({ companyUid: companyUid, inventoryUid: inventoryUid, startTime: data.alarmTimeStart })
        // console.log('found alert', notif)
        try {
            const update = await this._model.updateOne({ companyUid: companyUid, inventoryUid: inventoryUid, deviceMacId: deviceMacId, startTime: data.alarmTimeStart },
                { endTime: data.alarmTimeEnd },
                function (err, res) {
                    if (err) throw err
                    console.log('filter', { companyUid: companyUid, inventoryUid: inventoryUid, startTime: data.alarmTimeStart })
                })

            return update
        } catch (error) {
            throw new Error(error)
        }
    }

    async getNotificationByCompanyUid (companyUid) {
        try {
            const notification = await this._model.find({ companyUid: companyUid }).exec()
            return notification
        } catch (error) {
            console.log('error in get notification by company inventory uid service')
            throw new Error(error)
        }
    }

    async getNotificationNoAckByCompanyUid (companyUid) {
        try {
            const notification = await this._model.find({ companyUid: companyUid, ack: null }).exec()
            return notification
        } catch (error) {
            console.log('error in get notification by company inventory uid service')
            throw new Error(error)
        }
    }

    async patchNotifAcknowledgeByCompanyUid (companyUid, notificationId, data) {
        try {
            const update = await this._model.updateOne(
                { companyUid: companyUid, _id: mongoose.Types.ObjectId(notificationId) },
                { ack: new Date().valueOf(), note: data.note }
            )
            return update
        } catch (error) {
            console.log('error in patch notification ack by company uid notification id service')
            throw new Error(error)
        }
    }
}

module.exports = NotificationService
