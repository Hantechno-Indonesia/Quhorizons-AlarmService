const NotificationHandler = require('./handlers')
const routes = require('./routes')

module.exports = {
    name: 'notification',
    version: '1.0.0',
    register: async (server, { service }) => {
        const notificationHandler = new NotificationHandler(service)
        server.route(routes(notificationHandler))
    }
}
