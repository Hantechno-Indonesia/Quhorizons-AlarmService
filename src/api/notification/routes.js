const routes = (handler) => [
    {
        method: 'GET',
        path: '/notification/{companyUid}',
        handler: handler.getNotificationByCompanyUidHandler
    },
    {
        method: 'GET',
        path: '/notification/{companyUid}/noack',
        handler: handler.getNotAckByCompanyUidHandler
    },
    {
        method: 'PATCH',
        path: '/notification/{companyUid}/{notifId}',
        handler: handler.patchNotificationAcknowledgeHandler
    },
    {
        method: 'GET',
        path: '/ping',
        handler: handler.checkSystemOnline
    },
    {
        method: 'GET',
        path: '/checkmail',
        handler: handler.checkMailSending
    }
]

module.exports = routes
