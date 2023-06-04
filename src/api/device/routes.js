const routes = (handler) => [
    {
        method: 'POST',
        path: '/device',
        handler: handler.postDeviceHandler
    },
    {
        method: 'PATCH',
        path: '/device/{companyUid}/{deviceUid}',
        handler: handler.patchDeviceByIdHandler
    },
    {
        method: 'DELETE',
        path: '/device/{companyUid}/{deviceUid}',
        handler: handler.deleteDeviceByIdHandler
    },
    {
        method: 'GET',
        path: '/devices/{companyUid}/status',
        handler: handler.getAllSensorStatusByCompanyHandler
    },
    {
        method: 'GET',
        path: '/devices/{companyUid}/status/{inventoryUid}',
        handler: handler.getAllSensorStatusByInventoryHandler
    }
]

module.exports = routes
