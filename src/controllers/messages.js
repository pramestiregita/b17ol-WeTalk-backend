const { Messages, Users } = require('../models')

const response = require('../helpers/response')
const { sendMsg: sendSchema } = require('../helpers/validation')

module.exports = {
  sendMsg: async (req, res) => {
    try {
      const { id: senderId } = req.user
      const { recipientId, content } = await sendSchema.validate(req.body)

      const find = await Users.findByPk(recipientId)

      if (find) {
        const data = { senderId, recipientId, content }

        const create = await Messages.create(data)

        if (create) {
          return response(res, 'Send message successfully', { data: create })
        } else {
          return response(res, 'Failed to send', {}, 400, false)
        }
      } else {
        return response(res, 'Recipient not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
