const { Messages, Users, sequelize } = require('../models')
const { Op } = require('sequelize')

const response = require('../helpers/response')
const { sendMsg: sendSchema } = require('../helpers/validation')
const paging = require('../helpers/pagination')
const io = require('../App')

module.exports = {
  sendMsg: async (req, res) => {
    try {
      const { id: senderId } = req.user
      let { id: recipientId } = req.params
      recipientId = parseInt(recipientId)
      const { content } = await sendSchema.validate(req.body)

      const find = await Users.findByPk(recipientId)

      if (senderId === recipientId) return response(res, 'Error', {}, 400, false)

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
            io.emit(recipientId, { senderId, message: content })
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

      const results = await Messages.findAll({
        where: {
          [Op.or]: [{ senderId: userId }, { recipientId: userId }],
          lastMsg: true
        },
        order: [['createdAt', 'DESC']],
        limit: pageInfo.limit,
        offset,
        include: [
          {
            model: Users,
            as: 'sender',
            attributes: ['id', 'name', 'avatar']
          },
          {
            model: Users,
            as: 'recipient',
            attributes: ['id', 'name', 'avatar']
          }
        ],
        attributes: {
          include: [
            [
              sequelize.literal('(SELECT IF(LENGTH(content)>30, CONCAT(SUBSTRING(content,1,35), "..."), null))'), 'preview'
            ]
          ]
        }
      })

      const unread = await Messages.count({
        where: {
          recipientId: userId,
          isRead: false
        },
        group: ['senderId']
      })

      return response(res, 'List of message', { pageInfo, unread, data: results })
    } catch (e) {
      console.log(e)
      return response(res, e.message, {}, 500, false)
    }
  },
  getMsg: async (req, res) => {
    try {
      const { id: userId } = req.user
      const { id: friendId } = req.params

      if (userId === parseInt(friendId)) {
        return response(res, 'Error', {}, 400, false)
      } else {
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

        await Messages.update({ isRead: true }, {
          where: {
            senderId: friendId,
            recipientId: userId,
            isRead: false
          }
        })

        const search = await Messages.findAll({
          where: {
            senderId: {
              [Op.or]: [userId, friendId]
            },
            recipientId: {
              [Op.or]: [userId, friendId]
            }
          },
          order: [['createdAt', 'DESC']],
          limit: pageInfo.limit,
          offset,
          include: [
            {
              model: Users,
              as: 'sender',
              attributes: ['id', 'name', 'avatar']
            },
            {
              model: Users,
              as: 'recipient',
              attributes: ['id', 'name', 'avatar']
            }
          ]
        })

        return response(res, 'List of message', { pageInfo, data: search })
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  deleteMsg: async (req, res) => {
    try {
      const { id } = req.params

      const find = await Messages.findByPk(id)
      let results = {}

      if (find) {
        const { senderId, recipientId, lastMsg } = find
        if (lastMsg) {
          const findAll = await Messages.findOne({
            where: {
              senderId: {
                [Op.or]: [senderId, recipientId]
              },
              recipientId: {
                [Op.or]: [senderId, recipientId]
              },
              lastMsg: false
            },
            order: [['createdAt', 'DESC']]
          })

          const { id: lastId } = findAll
          const lasted = await Messages.update({ lastMsg: true }, { where: { id: lastId } })

          if (lasted) {
            results = await Messages.destroy({ where: { id } })
          }
        } else {
          results = await Messages.destroy({ where: { id } })
        }

        if (results) {
          return response(res, 'Delete message successfully')
        } else {
          return response(res, 'Failed to delete', {}, 400, false)
        }
      } else {
        return response(res, 'Message not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
