// const GatewayModel = require('./../Models/device')
const _ = require('lodash')

class GatewayService {
    constructor (model) {
        this._model = model
    }

    async addGateway (data) {
        try {
            const gateway = new this._model(data)
            const gatewayCount = await this.getByGatewayMacOrUid(data.gatewayMacId)

            if (gatewayCount > 0) throw new Error('Gateway Uid / Gateway Mac already exists')

            const result = await gateway.save(function (err, res) {
                if (err) throw err
            })
            return result
        } catch (error) {
            throw new Error(error)
        }
    }

    async getByGatewayMacOrUid (uid, mac) {
        try {
            const gateway = await this._model.countDocuments({ $or: [{ gatewayUid: uid }, { gatewayMacId: uid }] })
            return gateway
        } catch (error) {
            throw new Error(error)
        }
    }

    async getByGatewayUid (uid) {
        try {
            const gatewayCount = await this._model.countDocuments({ gatewayUid: uid })
            return gatewayCount
        } catch (error) {
            throw new Error(error)
        }
    }

    async removeGatewayByCompanyGatewayUid (companyUid, gatewayUid) {
        console.log('deleting', companyUid, gatewayUid)
        const result = await this._model.deleteOne({
            companyUid: companyUid, gatewayUid: gatewayUid
        })
        return result
    }

    async updateGatewayByCompanyGatewayUid (companyUid, gatewayUid, data) {
        try {
            const gateway = await this._model.updateOne({
                companyUid: companyUid, gatewayUid: gatewayUid
            }, data, function (err, res) {
                if (err) throw new Error(err)
            })

            return gateway
        } catch (error) {
            throw new Error(error)
        }
    }

    async getGatewayByGatewayMacId (gatewayMacId, vendor) {
        try {
            const device = await this._model.findOne({ gatewayMacId: gatewayMacId })
            return device
        } catch (error) {
            throw new Error(error)
        }
    }

    async getGatewaysByCompanyUid (companyUid) {
        try {
            const gateways = await this._model.find({ companyUid: companyUid }).exec()
            return gateways
        } catch (error) {
            console.log('Error get gateway ids by company uid', error)
            return []
        }
    }

    async getGatewaysByCompanyInventoryUid (companyUid, inventoryUid) {
        try {
            const gateways = await this._model.find({ companyUid: companyUid, inventoryUid: inventoryUid }).exec()
            return gateways
        } catch (error) {
            console.log('Error get gateway ids by company uid', error)
            return []
        }
    }

    generateFineStatus (gatewayInfos, devices, periodInSecond = 60) {
        try {
            const groupedDevices = _.groupBy(devices, 'gatewayMacId')
            const result = []
            for (const gw of gatewayInfos) {
                let temp = {
                    gatewayUid: gw.gatewayUid,
                    gatewayMacId: gw.gatewayMacId
                }
                const arrDevice = groupedDevices[gw.gatewayMacId]
                if (typeof arrDevice !== 'undefined') {
                    const sorted = _.sortBy(groupedDevices[gw.gatewayMacId], 'time')
                    const lastRecordData = sorted[sorted.length - 1]
                    const timeLimit = Date.now() - (periodInSecond * 1000)
                    const isOnline = sorted.filter(dv => dv.lastRecord > timeLimit)

                    temp = {
                        ...temp,
                        lastRecord: lastRecordData.lastRecord,
                        isOnline: isOnline.length,
                        isOnlineIds: isOnline.map(it => it.deviceUid),
                        devicesCounter: sorted.length
                    }
                }
                result.push(temp)
                console.log(result)
            }
            return result
        } catch (error) {
            console.log('Error generate fine data', error)
            return devices
        }
    }
}

module.exports = GatewayService
