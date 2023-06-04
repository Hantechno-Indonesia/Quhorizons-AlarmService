// const DeviceModel = require('./../Models/device')
// const _ = require('lodash')

class AlarmService {
    constructor (model) {
        this._model = model
    }

    async addAlarm (data) {
        try {
            const alarm = new this._model(data)
            const alarmCount = await this.getByInventoryUid(data.inventoryUid)

            if (alarmCount > 0) throw new Error('Device / Mac already exists')

            const result = await alarm.save(function (err, res) {
                if (err) throw err
            })
            return result
        } catch (error) {
            throw new Error(error)
        }
    }

    async getByInventoryUid (uid) {
        try {
            const alarmCount = await this._model.countDocuments({ inventoryUid: uid })
            return alarmCount
        } catch (error) {
            throw new Error(error)
        }
    }

    async getByCompanyInventoryUid (companyUid, inventoryUid) {
        try {
            const alarmCount = await this._model.findOne({ companyUid: companyUid, inventoryUid: inventoryUid })
            return alarmCount
        } catch (error) {
            throw new Error(error)
        }
    }

    async updateAlarm (companyUid, inventoryUid, data) {
        try {
            const update = this._model.updateOne({
                companyUid: companyUid, inventoryUid: inventoryUid
            }, data, function (err, res) {
                if (err) {
                    console.log('Failed update alarm in db')
                }
            })

            return update
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteAlarm (companyUid, inventoryUid) {
        try {
            const update = this._model.deleteOne({
                companyUid: companyUid, inventoryUid: inventoryUid
            }, function (err, res) {
                if (err) {
                    console.log('Failed delete alarm in db')
                }
            })

            return update
        } catch (error) {
            throw new Error(error)
        }
    }

    async getAlarmByCompanyUid (companyUid) {
        try {
            const alarms = this._model.find({
                companyUid: companyUid
            }).exec()

            return alarms
        } catch (error) {
            throw new Error(error)
        }
    }

    async getAlarmByCompanyInventoryUid (companyUid, inventoryUid) {
        try {
            const alarms = this._model.findOne({
                companyUid: companyUid,
                inventoryUid: inventoryUid
            })

            return alarms
        } catch (error) {
            throw new Error(error)
        }
    }

    async checkMeasurement (alarmInfo, deviceFlag, measurement) {
        const { tempVal = null, humVal = null } = measurement
        let { alarmTimeStart = null, alertTimeStart = null } = deviceFlag
        let { alertTimeEnd = null, alarmTimeEnd = null } = deviceFlag
        let alertTrigger = false
        let alarmTrigger = false
        let tempViolation = false
        let humViolation = false
        let actions = []
        let messageNew = []

        // console.log('Alert Time Start', alertTimeStart, alarmInfo.alertTimeStart)

        if (tempVal !== null) {
            if (alarmInfo.alarmTempUpper !== null && tempVal > alarmInfo.alarmTempUpper) {
                // console.log(`${tempVal} &#8451; higher than ${alarmInfo.alarmTempUpper}&#8451;`)
                messageNew.push(`Temperature ${tempVal}&#8451; higher than ${alarmInfo.alarmTempUpper}&#8451;`)
                tempViolation = true
                alarmTrigger = true
            }

            if (tempViolation === false && alarmInfo.alarmTempLower !== null && tempVal < alarmInfo.alarmTempLower) {
                // console.log(`${tempVal}&#8451; lower than ${alarmInfo.alarmTempLower}&#8451;`)
                messageNew.push(`Temperature ${tempVal}&#8451; lower than ${alarmInfo.alarmTempLower}&#8451;`)
                tempViolation = true
                alarmTrigger = true
            }

            if (tempViolation === false && alarmInfo.alertTempUpper !== null && tempVal > alarmInfo.alertTempUpper) {
                // console.log(`${tempVal}&#8451; higher than ${alarmInfo.alertTempUpper}&#8451;`)
                messageNew.push(`Temperature ${tempVal}&#8451; higher than ${alarmInfo.alertTempUpper}&#8451;`)
                tempViolation = true
                alertTrigger = true
            }

            if (tempViolation === false && alarmInfo.alertTempLower !== null && tempVal < alarmInfo.alertTempLower) {
                // console.log(`${tempVal}&#8451; lower than ${alarmInfo.alertTempLower}&#8451;`)
                messageNew.push(`Temperature ${tempVal}&#8451; lower than ${alarmInfo.alertTempLower}&#8451;`)
                tempViolation = true
                alertTrigger = true
            }
        }

        if (humVal !== null) {
            if (alarmInfo.alarmHumUpper !== null && humVal > alarmInfo.alarmHumUpper) {
                // console.log(`${humVal}%RH higher than ${alarmInfo.alarmHumUpper}`)
                messageNew.push(`Humidity ${humVal}%RH higher than ${alarmInfo.alarmHumUpper}%RH`)
                humViolation = true
                alarmTrigger = true
            }

            if (humViolation === false && alarmInfo.alarmHumLower !== null && humVal < alarmInfo.alarmHumLower) {
                // console.log(`${humVal}%RH lower than ${alarmInfo.alarmHumLower}%RH`)
                messageNew.push(`Humidity ${humVal}%RH lower than ${alarmInfo.alarmHumLower}%RH`)
                humViolation = true
                alarmTrigger = true
            }

            if (humViolation === false && alarmInfo.alertHumUpper !== null && humVal > alarmInfo.alertHumUpper) {
                // console.log(`${humVal}%RH higher than ${alarmInfo.alertHumUpper}%RH`)
                messageNew.push(`Humidity ${humVal}%RH higher than ${alarmInfo.alertHumUpper}%RH`)
                humViolation = true
                alertTrigger = true
            }

            if (humViolation === false && alarmInfo.alertHumLower !== null && humVal < alarmInfo.alertHumLower) {
                // console.log(`${humVal}%RH lower than ${alarmInfo.alertTempLower}%RH`)
                messageNew.push(`Humidity ${humVal}%RH lower than ${alarmInfo.alertTempLower}%RH`)
                humViolation = true
                alertTrigger = true
            }
        }

        if (alarmTrigger) {
            if (alarmTimeStart === null) {
                actions.push('new-alarm')
                alarmTimeStart = measurement.time
                alertTimeEnd = null
            }

            if (alertTimeStart !== null) {
                actions.push('end-alert')
                // console.log(2, alertTimeStart)
                alertTimeEnd = parseInt(measurement.time)
            }
        } else if (alertTrigger) {
            if (alertTimeStart === null) {
                actions.push('new-alert')
                // console.log(3)
                alertTimeStart = measurement.time
                alertTimeEnd = null
            }

            if (alarmTimeStart) {
                // console.log(4)
                actions.push('end-alarm')
                alarmTimeEnd = parseInt(measurement.time)
            }
        } else {
            if (alertTimeStart !== null) {
                // console.log(5, alertTimeStart)
                actions.push('end-alert')
                alertTimeEnd = parseInt(measurement.time)
            }
            if (alarmTimeStart !== null) {
                // console.log(6)
                actions.push('end-alarm')
                alarmTimeEnd = parseInt(measurement.time)
            }
        }

        const result = {
            tempViolation: tempViolation,
            humViolation: humViolation,
            tempVal: tempVal,
            humVal: humVal,
            alertTrigger: alertTrigger,
            alarmTrigger: alarmTrigger,
            alarmTimeStart: alarmTimeStart,
            alarmTimeEnd: alarmTimeEnd,
            alertTimeStart: alertTimeStart,
            alertTimeEnd: alertTimeEnd,
            actions: actions,
            message: messageNew
        }

        return result
    }

    async saveNewAlertStatus (alarmObjectId, data) {
        try {
            const update = this._model.updateOne({ _id: alarmObjectId }, {
                alarmTimeStart: data.alarmTimeEnd == null ? data.alarmTimeStart : null,
                alertTimeStart: data.alertTimeEnd == null ? data.alertTimeStart : null
            })
            return update
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = AlarmService
