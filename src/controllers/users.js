const { Users } = require('../models')

const response = require('../helpers/response')
const { login: loginSchema, setProfile } = require('../helpers/validation')
const upload = require('../helpers/uploadAvatar').single('avatar')
const multer = require('multer')
const fs = require('fs')
const jwt = require('jsonwebtoken')

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
          id = create.dataValues.id
        } else {
          return response(res, 'Failed to login', {}, 400, false)
        }
      } else {
        id = find[0].dataValues.id
      }

      if (id > 0) {
        jwt.sign({ id }, SECRET_KEY, { expiresIn: '10 m' }, (err, token) => {
          if (err) {
            return response(res, err.message, {}, 500, false)
          } else {
            return response(res, 'Login succesfully', { token })
          }
        })
      }
    } catch (e) {
      console.log(e)
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
        let avatar = null

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
  }
}
