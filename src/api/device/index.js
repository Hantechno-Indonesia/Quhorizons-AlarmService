const DeviceHandler = require('./handlers')
const routes = require('./routes')

module.exports = {
    name: 'devices',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const deviceHandler = new DeviceHandler(service, validator)
        server.route(routes(deviceHandler))
    }
}
