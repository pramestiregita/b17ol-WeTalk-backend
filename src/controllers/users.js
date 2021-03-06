const { Users } = require('../models')

const response = require('../helpers/response')
const { setProfile, addToken } = require('../helpers/validation')
const pagination = require('../helpers/pagination')
const upload = require('../helpers/uploadAvatar')

const multer = require('multer')
const fs = require('fs')
const { Op } = require('sequelize')

module.exports = {
  getProfile: async (req, res) => {
    try {
      const { id } = req.user

      const results = await Users.findByPk(id)

      if (results) {
        return response(res, 'Detail user', { data: results })
      } else {
        return response(res, 'User not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  updateData: async (req, res) => {
    try {
      const { id } = req.user
      const { name, email } = await setProfile.validate(req.body)
      const data = { name, email }

      const create = await Users.update(data, { where: { id } })

      if (create.length) {
        return response(res, 'Set profile successfully', { data })
      } else {
        return response(res, 'Failed to set profile', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  updateAva: async (req, res) => {
    upload(req, res, async (err) => {
      let picture = null
      try {
        if (err instanceof multer.MulterError) {
          return response(res, err.message, {}, 500, false)
        } else if (err) {
          return response(res, err.message, {}, 500, false)
        }

        const { id } = req.user
        let avatar

        if (req.file) {
          picture = req.file
          avatar = 'upload/' + req.file.filename
        }

        const data = { avatar }

        const create = await Users.update(data, { where: { id } })

        if (create.length) {
          return response(res, 'Update profile successfully', { data })
        } else {
          return response(res, 'Failed to set profile', {}, 400, false)
        }
      } catch (e) {
        picture && fs.unlink(picture.path, (err) => {
          if (err) {
            return response(res, err.message, {}, 500, false)
          }
        })

        return response(res, e.message, {}, 500, false)
      }
    })
  },
  getFriend: async (req, res) => {
    try {
      const { id } = req.params

      const find = await Users.findByPk(id, { attributes: { exclude: ['email'] } })

      if (find) {
        return response(res, 'Detail friend', { data: find })
      } else {
        return response(res, 'User not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  getFriends: async (req, res) => {
    try {
      const { id } = req.user
      const { search = '' } = req.query

      const count = await Users.count({
        where: {
          id: {
            [Op.not]: id
          },
          name: {
            [Op.substring]: search
          }
        }
      })

      const { pageInfo, offset } = pagination(req, count)

      const results = await Users.findAll({
        where: {
          id: {
            [Op.not]: id
          },
          name: {
            [Op.substring]: search
          }
        },
        order: [['name', 'ASC']],
        limit: pageInfo.limit,
        offset
      })

      return response(res, 'My contact', { pageInfo, data: results })
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  addDeviceToken: async (req, res) => {
    try {
      const { id } = req.user
      const { token } = await addToken.validate(req.body)

      const find = await Users.findByPk(id)

      if (find) {
        const add = await Users.update({ deviceToken: token }, {
          where: { id }
        })

        if (add) {
          return response(res, 'Add device token successfully', { deviceToken: token })
        } else {
          return response(res, 'Failed to add device token', {}, 400, false)
        }
      } else {
        return response(res, 'User not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  deleteDeviceToken: async (req, res) => {
    try {
      const { id } = req.user

      const find = await Users.findByPk(id)

      if (find) {
        const add = await Users.update({ deviceToken: null }, {
          where: { id }
        })

        if (add) {
          return response(res, 'Delete device token successfully')
        } else {
          return response(res, 'Failed to add device token', {}, 400, false)
        }
      } else {
        return response(res, 'User not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
