const Hapi = require('@hapi/hapi')
// Plugins
const alarm = require('./src/api/alarm')
const AlarmService = require('./src/services/AlarmService')
const Mongoose = require('mongoose')

// Notification
const notification = require('./src/api/notification')
const NotificationService = require('./src/services/NotificationService')

// Device Flag
const DeviceFlagService = require('./src/services/DeviceFlagService')

// Mailer
const MailerService = require('./src/services/MailerService')

// Validator
const AlarmValidator = require('./src/validator/alarm')

// Models
const AlarmModel = require('./src/Models/Alarm')
const NotificationModel = require('./src/Models/Notification')
const DeviceFlagModel = require('./src/Models/DeviceFlag')

const init = async () => {
    const alarmService = new AlarmService(AlarmModel)
    const notificationService = new NotificationService({ NotificationModel, AlarmModel })
    const deviceFlagService = new DeviceFlagService(DeviceFlagModel)
    const mailerService = new MailerService('mail service created')
    const services = { alarmService, notificationService, deviceFlagService, mailerService }

    Mongoose.connect('mongodb://localhost/alarm-service', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('DB Connected'))
        .catch((err) => {
            console.log('DBERROR', err)
        })

    const server = Hapi.server({
        port: 5002,
        host: 'localhost',
        routes: {
            cors: true
        }
    })

    await server.register([
        {
            plugin: alarm,
            options: {
                service: services,
                validator: AlarmValidator,
                model: AlarmModel
            }
        },
        {
            plugin: notification,
            options: {
                service: services,
                model: NotificationModel
            }
        }
    ])

    await server.start()
    console.log(`Server runs on ${server.info.uri}`)
}

init()
