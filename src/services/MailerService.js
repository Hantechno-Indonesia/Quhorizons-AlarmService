// const DeviceModel = require('./../Models/device')
// const _ = require('lodash')
const fetch = require('node-fetch')
const Mailgun = require('mailgun-js')
const DOMAIN = 'quhorizons.com'
const SENT_TO_MAIL = 'abdulrahimk@qhorizons.com.sa'
const mg = Mailgun({ apiKey: '8e57be1cc5219ed9750f1b446c50aca5-2ac825a1-032e6a3f', domain: DOMAIN, host: 'api.eu.mailgun.net' })

class MailerService {
    constructor (test) {
        console.log(test)
    }

    async generateMailNotification (alarmCriteria, deviceMacId, deviceName, check) {
        // create new notification if new trigger accur (trigger accur and endTime provided)
        // console.log('notif', deviceMacId, deviceName)
        // if (deviceMacId !== 'test') {
        //     return null
        // }
        const companyDetail = await fetch(`https://quhorizons.com/api/company/${alarmCriteria.companyUid}`)
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else {
                    console.log('failed to get company data')
                    return null
                }
            })
            .catch(err => {
                console.log('error fetch company data', err)
                return null
            })

        if (companyDetail === null) {
            console.log('company send email failed, cannot get company info')
            return null
        }

        const inventoryDetail = await fetch(`https://quhorizons.com/api/inventory/${alarmCriteria.inventoryUid}`)
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else {
                    console.log('failed to get inventory data')
                    return null
                }
            })
            .catch(err => {
                console.log('error fetch inventory data', err)
                return null
            })
        if (inventoryDetail === null) {
            console.log('company send email failed, cannot get inventory info')
            return null
        }

        const payload = {
            company_name: companyDetail.name,
            email: inventoryDetail.warehouse.email,
            manager_name: companyDetail.manager_name,
            warehouse_name: inventoryDetail.warehouse.name,
            inventory_name: inventoryDetail.name,
            device_name: deviceName,
            device_mac: deviceMacId,
            temp: check.tempVal,
            hum: check.humVal,
            alarm_temp_upper: alarmCriteria.alarmTempUpper,
            alarm_temp_lower: alarmCriteria.alarmTempLower,
            alarm_hum_upper: alarmCriteria.alarmHumUpper,
            alarm_hum_lower: alarmCriteria.alarmHumLower,
            alert_temp_upper: alarmCriteria.alertTempUpper,
            alert_temp_lower: alarmCriteria.alertTempLower,
            alert_hum_upper: alarmCriteria.alertHumUpper,
            alert_hum_lower: alarmCriteria.alertHumLower
        }

        for (const action of check.actions) {
            switch (action) {
            case 'new-alert': this.sendAlert(payload)
                break
            case 'new-alarm': this.sendAlarm(payload)
                break
            case 'end-alert': this.endAlert(payload)
                break
            case 'end-alarm': this.endAlarm(payload)
                break
            }
        }

        // update notification if endTime provided but trigger not accur
    }

    async endAlert (payload) {
        console.log('sending end alert')
        // const vars = {
        //     'v:warehouse_name': payload.warehouse_name,
        //     'v:inventory_name': payload.inventory_name,
        //     'v:device_name': payload.device_name,
        //     'v:temp_val': payload.temp,
        //     'v:hum_val': payload.hum,
        //     'v:alarm_temp_upper': payload.alarm_temp_upper,
        //     'v:alarm_temp_lower': payload.alarm_temp_lower,
        //     'v:alarm_hum_upper': payload.alarm_hum_upper,
        //     'v:alarm_hum_lower': payload.alarm_hum_lower,
        //     'v:alert_temp_upper': payload.alert_temp_upper,
        //     'v:alert_temp_lower': payload.alert_temp_lower,
        //     'v:alert_hum_upper': payload.alert_hum_upper,
        //     'v:alert_hum_lower': payload.alert_hum_lower
        // }
        const data = {
            from: 'Quality Horizons Notification <no-reply@quhorizons.com>',
            to: payload.email,
            subject: `ALERT ENDED for Sensor ${payload.device_name} - Quhorizons.com`,
            template: 'sensor_alert_end',
	        'h:X-Mailgun-Variables': JSON.stringify(payload)
        }
        console.log('Payload', data)
        return await mg.messages().send(data, (error, body) => {
            console.log(body)
            console.log(error)
        })
    }

    async endAlarm (payload) {
        console.log('sending end alarm')
        const data = {
            from: 'Quality Horizons Notification <no-reply@quhorizons.com>',
            to: payload.email,
            subject: `ALARM ENDED for Sensor ${payload.device_name} - Quhorizons.com`,
            template: 'sensor_alarm_end',
	        'h:X-Mailgun-Variables': JSON.stringify(payload)
        }
        console.log('Payload', data)
        return await mg.messages().send(data, (error, body) => {
            console.log(body)
            console.log(error)
        })
    }

    async sendAlert (payload) {
        console.log('sending alert')
        // const vars = {
        //     'v:warehouse_name': payload.warehouse_name,
        //     'v:inventory_name': payload.inventory_name,
        //     'v:device_name': payload.device_name,
        //     'v:temp_val': payload.temp,
        //     'v:hum_val': payload.hum,
        //     'v:alarm_temp_upper': payload.alarm_temp_upper,
        //     'v:alarm_temp_lower': payload.alarm_temp_lower,
        //     'v:alarm_hum_upper': payload.alarm_hum_upper,
        //     'v:alarm_hum_lower': payload.alarm_hum_lower,
        //     'v:alert_temp_upper': payload.alert_temp_upper,
        //     'v:alert_temp_lower': payload.alert_temp_lower,
        //     'v:alert_hum_upper': payload.alert_hum_upper,
        //     'v:alert_hum_lower': payload.alert_hum_lower
        // }
        const data = {
            from: 'Quality Horizons Notification <no-reply@quhorizons.com>',
            to: payload.email,
            subject: `SENSOR ALERT for Sensor ${payload.device_name}- Quhorizons.com`,
            template: 'sensor_alert_1',
	        'h:X-Mailgun-Variables': JSON.stringify(payload)
        }
        console.log('Payload', data)
        return await mg.messages().send(data, (error, body) => {
            console.log(body)
            console.log(error)
        })
    }

    async sendAlarm (payload) {
        console.log('sending alarm')
        // const vars = {
        //     'v:warehouse_name': payload.warehouse_name,
        //     'v:inventory_name': payload.inventory_name,
        //     'v:device_name': payload.device_name,
        //     'v:temp_val': payload.temp,
        //     'v:hum_val': payload.hum,
        //     'v:alarm_temp_upper': payload.alarm_temp_upper,
        //     'v:alarm_temp_lower': payload.alarm_temp_lower,
        //     'v:alarm_hum_upper': payload.alarm_hum_upper,
        //     'v:alarm_hum_lower': payload.alarm_hum_lower,
        //     'v:alert_temp_upper': payload.alert_temp_upper,
        //     'v:alert_temp_lower': payload.alert_temp_lower,
        //     'v:alert_hum_upper': payload.alert_hum_upper,
        //     'v:alert_hum_lower': payload.alert_hum_lower
        // }
        const data = {
            from: 'Quality Horizons Notification <no-reply@quhorizons.com>',
            to: payload.email,
            subject: `SENSOR ALARM for Sensor ${payload.device_name}- Quhorizons.com`,
            template: 'sensor_alarm_1',
	        'h:X-Mailgun-Variables': JSON.stringify(payload)
        }
        console.log('Payload', data)
        // return data
        return await mg.messages().send(data, (error, body) => {
            console.log(body)
            console.log(error)
        })
    }
}

module.exports = MailerService
