const routes = (handler) => [
    {
        method: 'POST',
        path: '/alarm',
        handler: handler.postAlarmHandler
    },
    {
        method: 'PATCH',
        path: '/alarm/{companyUid}/{inventoryUid}',
        handler: handler.patchAlarmByInventoryUidHandler
    },
    {
        method: 'POST',
        path: '/alarm/{companyUid}/{inventoryUid}',
        handler: handler.deleteAlarmByInventoryUidHandler
    },
    {
        method: 'GET',
        path: '/alarms/{companyUid}/all',
        handler: handler.getAllAlarmByCompanyUidHandler
    },
    {
        method: 'GET',
        path: '/alarms/{companyUid}/{inventoryUid}',
        handler: handler.getAlarmByCompanyInventoryUidHandler
    },
    {
        method: 'POST',
        path: '/alarm/check',
        handler: handler.postCheckMeasurementHandler
    },
    {
        method: 'GET',
        path: '/inalarm/{companyUid}',
        handler: handler.getAllSensorInAlarmHandler
    }
]

module.exports = routes
