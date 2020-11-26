const { Users } = require('../models')

const response = require('../helpers/response')
const { login: loginSchema, setProfile } = require('../helpers/validation')
const upload = require('../helpers/uploadAvatar').single('avatar')
const multer = require('multer')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const pagination = require('../helpers/pagination')

const { SECRET_KEY } = process.env

module.exports = {
  login: async (req, res) => {
    try {
      const { phoneNumber } = await loginSchema.validate(req.body)
      const find = await Users.findAll({ where: { phoneNumber } })
      let id = 0

      if (!find.length) {
        const create = await Users.create({ phoneNumber })

        if (create) {
          id = create.id
        } else {
          return response(res, 'Failed to login', {}, 400, false)
        }
      } else {
        id = find[0].id
      }

      if (id > 0) {
        jwt.sign({ id }, SECRET_KEY, { expiresIn: '10 h' }, (err, token) => {
          if (err) {
            return response(res, err.message, {}, 500, false)
          } else {
            return response(res, 'Login succesfully', { token })
          }
        })
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
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
  setProfile: async (req, res) => {
    upload(req, res, async (err) => {
      let picture = null
      try {
        if (err instanceof multer.MulterError) {
          return response(res, err.message, {}, 500, false)
        } else if (err) {
          return response(res, err.message, {}, 500, false)
        }

        const { id } = req.user
        const { name } = await setProfile.validate(req.body)
        let avatar

        if (req.file) {
          picture = req.file
          avatar = 'upload/' + req.file.filename
        }

        const data = { name, avatar }

        const create = await Users.update(data, { where: { id } })

        if (create.length) {
          return response(res, 'Set profile successfully', { data })
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

      return response(res, 'My contact', { data: results, pageInfo })
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
