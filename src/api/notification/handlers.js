
class NotificationHandler {
    constructor (service) {
        const { notificationService, mailerService } = service
        this._service = notificationService
        this._mailerService = mailerService

        this.getNotificationByCompanyUidHandler = this.getNotificationByCompanyUidHandler.bind(this)
        this.getNotAckByCompanyUidHandler = this.getNotAckByCompanyUidHandler.bind(this)
        this.patchNotificationAcknowledgeHandler = this.patchNotificationAcknowledgeHandler.bind(this)
        this.checkSystemOnline = this.checkSystemOnline.bind(this)
        this.checkMailSending = this.checkMailSending.bind(this)
    }

    async getNotificationByCompanyUidHandler (request, h) {
        try {
            const { companyUid } = request.params

            const notification = await this._service.getNotificationByCompanyUid(companyUid)

            const data = {
                notif: notification,
                summary: {
                    count: notification.length,
                    alarm: notification.filter(n => {
                        return n.type === 'alarm' && n.ack == null
                    }).length,
                    alert: notification.filter(n => {
                        return n.type === 'alert' && n.ack == null
                    }).length
                }
            }
            const response = h.response({
                status: 'success',
                data: data
            })

            response.code(200)
            return response
        } catch (error) {
            console.log(error)
            const response = h.response({
                status: 'fail',
                message: error.message
            })

            response.code(400)
            return response
        }
    }

    async getNotAckByCompanyUidHandler (request, h) {
        try {
            const { companyUid } = request.params

            const notification = await this._service.getNotificationNoAckByCompanyUid(companyUid)

            const response = h.response({
                status: 'success',
                data: notification
            })

            response.code(200)
            return response
        } catch (error) {
            console.log(error)
            const response = h.response({
                status: 'fail',
                message: error.message
            })

            response.code(400)
            return response
        }
    }

    async patchNotificationAcknowledgeHandler (request, h) {
        try {
            const { companyUid, notifId } = request.params

            const notification = await this._service.patchNotifAcknowledgeByCompanyUid(companyUid, notifId, request.payload)

            const response = h.response({
                status: 'success',
                data: notification
            })

            response.code(200)
            return response
        } catch (error) {
            console.log(error)
            const response = h.response({
                status: 'fail',
                message: error.message
            })

            response.code(400)
            return response
        }
    }

    async checkSystemOnline (request, h) {
        const response = h.response({
            status: 'success'
        })

        response.code(200)
        return response
    }

    async checkMailSending (request, h) {
        const send = await this._mailerService.sendAlert()
        const response = h.response({
            status: 'success',
            send: send
        })

        response.code(200)
        return response
    }
}

module.exports = NotificationHandler
