const AlarmHandler = require('./handlers')
const routes = require('./routes')

module.exports = {
    name: 'alarm',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const alarmHandler = new AlarmHandler(service, validator)
        server.route(routes(alarmHandler))
    }
}
