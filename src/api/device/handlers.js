const ClientError = require('../../Exceptions/ClientError')
const DBDeleteError = require('../../Exceptions/DbDeleteError')

class DeviceHandler {
    constructor (service, validator) {
        const { deviceService, recordService } = service
        this._service = deviceService
        this._recordService = recordService
        this._validator = validator

        this.postDeviceHandler = this.postDeviceHandler.bind(this)
        this.patchDeviceByIdHandler = this.patchDeviceByIdHandler.bind(this)
        this.deleteDeviceByIdHandler = this.deleteDeviceByIdHandler.bind(this)
        this.getAllSensorStatusByCompanyHandler = this.getAllSensorStatusByCompanyHandler.bind(this)
        this.getAllSensorStatusByInventoryHandler = this.getAllSensorStatusByInventoryHandler.bind(this)
    }

    async postDeviceHandler (request, h) {
        try {
            this._validator.validatePostDevicePayload(request.payload)

            const insertDevice = await this._service.addDevice(request.payload)

            const response = h.response({
                status: 'success',
                message: 'device created successfully',
                data: insertDevice
            })

            response.code(200)
            return response
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message
            })
            response.code(400)
            return response
        }
    }

    async patchDeviceByIdHandler (request, h) {
        try {
            console.log('PATCH Device')
            this._validator.validateDeleteDeviceParams(request.params)
            this._validator.validatePostDevicePayload(request.payload)

            const { companyUid, deviceUid } = request.params
            const updateDevice = await this._service.updateDeviceByCompanyDeviceUid(companyUid, deviceUid, request.payload)

            const response = h.response({
                status: 'success',
                message: 'Device has been updated',
                data: updateDevice
            })

            response.code(200)
            return response
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message
            })
            response.code(400)
            return response
        }
    }

    async deleteDeviceByIdHandler (request, h) {
        try {
            console.log('DELETE Device')
            this._validator.validateDeleteDeviceParams(request.params)
            const { companyUid, deviceUid } = request.params
            const removeDevice = await this._service.removeDeviceByCompanyDeviceUid(companyUid, deviceUid)

            if (removeDevice.n === 0) {
                console.log('device not found')
                // throw new NotFoundError('Data device not found', 404, 'handler')
            } else if (!removeDevice.ok || removeDevice.deletedCount === 0) {
                throw new DBDeleteError('Device found but not deleted', 500, 'devicedb', removeDevice)
            }

            const response = h.response({
                status: 'success',
                message: 'device created successfully',
                data: removeDevice
            })

            response.code(200)
            return response
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                response.code(error.statusCode)
                return response
            } else {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                    extra: error.extra
                })
                response.code(error.statusCode)
                return response
            }
        }
    }

    async getAllSensorStatusByCompanyHandler (request, h) {
        const { companyUid } = request.params

        // get all devices id
        const devices = await this._service.getDeviceByCompanyUid(companyUid)
        const devicesIds = devices.map(it => it.id)

        // get last record in last 60 second for devices id
        const records = await this._recordService.getLastRecordsByDevicesIds(devicesIds, 3600)

        // generate fine status data from device info and records
        const statuses = this._service.generateFineStatus(devices, records)

        const response = h.response({
            status: 0,
            data: statuses
        })
        response.code(200)
        return response
    }

    async getAllSensorStatusByInventoryHandler (request, h) {
        const { companyUid, inventoryUid } = request.params

        // get all devices id
        const devices = await this._service.getDeviceByCompanyInventoryUid(companyUid, inventoryUid)
        const devicesIds = devices.map(it => it.id)

        // get last record in last 60 second for devices id
        const records = await this._recordService.getLastRecordsByDevicesIds(devicesIds, 3600)

        // // generate fine status data from device info and records
        const statuses = this._service.generateFineStatus(devices, records)

        const response = h.response({
            status: 0,
            data: statuses
        })
        response.code(200)
        return response
    }
}

module.exports = DeviceHandler
