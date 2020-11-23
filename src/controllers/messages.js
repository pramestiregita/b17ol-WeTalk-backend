const { Messages, Users } = require('../models')
const { Op } = require('sequelize')

const response = require('../helpers/response')
const { sendMsg: sendSchema } = require('../helpers/validation')
const paging = require('../helpers/pagination')

module.exports = {
  sendMsg: async (req, res) => {
    try {
      const { id: senderId } = req.user
      const { recipientId, content } = await sendSchema.validate(req.body)

      const find = await Users.findByPk(recipientId)

      if (find) {
        const last = await Messages.update({ lastMsg: false }, {
          where: {
            senderId: {
              [Op.or]: [senderId, recipientId]
            },
            recipientId: {
              [Op.or]: [senderId, recipientId]
            },
            lastMsg: true
          }
        })

        if (last) {
          const data = { senderId, recipientId, content }

          const create = await Messages.create(data)

          if (create) {
            return response(res, 'Send message successfully', { data: create })
          } else {
            return response(res, 'Failed to send', {}, 400, false)
          }
        } else {
          return response(res, 'Failed to send', {}, 400, false)
        }
      } else {
        return response(res, 'Recipient not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  getAll: async (req, res) => {
    try {
      const { id: userId } = req.user

      const count = await Messages.count({
        where: {
          [Op.or]: [{ senderId: userId }, { recipientId: userId }],
          lastMsg: true
        }
      })

      const { pageInfo, offset } = paging(req, count)

      const search = await Messages.findAll({
        where: {
          [Op.or]: [{ senderId: userId }, { recipientId: userId }],
          lastMsg: true
        },
        limit: pageInfo.limit,
        offset
      })

      return response(res, 'List of message', { data: search, pageInfo })
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  getMessage: async (req, res) => {
    try {
      const { id: userId } = req.user
      const { id: friendId } = req.params

      const count = await Messages.count({
        where: {
          senderId: {
            [Op.or]: [userId, friendId]
          },
          recipientId: {
            [Op.or]: [userId, friendId]
          }
        }
      })

      const { pageInfo, offset } = paging(req, count)

      const search = await Messages.findAll({
        where: {
          senderId: {
            [Op.or]: [userId, friendId]
          },
          recipientId: {
            [Op.or]: [userId, friendId]
          }
        },
        limit: pageInfo.limit,
        offset
      })

      return response(res, 'List of message', { data: search, pageInfo })
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
