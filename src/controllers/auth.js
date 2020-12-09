const { Users } = require('../models')

const response = require('../helpers/response')
const { login: loginSchema, reLogin: refreshTokenSchema } = require('../helpers/validation')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../middlewares/jwtHelpers')

module.exports = {
  login: async (req, res) => {
    try {
      const { phoneNumber } = await loginSchema.validate(req.body)
      const find = await Users.findOne({ where: { phoneNumber } })
      let id = 0

      if (!find) {
        const create = await Users.create({ phoneNumber })

        if (create) {
          id = create.id
        } else {
          return response(res, 'Failed to login', {}, 400, false)
        }
      } else {
        id = find.id
      }

      if (id > 0) {
        const token = await signAccessToken(id)
        const refreshToken = await signRefreshToken(id)

        return response(res, 'Login succesfully', { token, refreshToken })
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  reLogin: async (req, res) => {
    try {
      const { refreshToken } = await refreshTokenSchema.validate(req.body)

      const id = await verifyRefreshToken(refreshToken)
      const token = await signAccessToken(id)
      const newRefToken = await signRefreshToken(id)

      return response(res, 'Relogin successfully', { token, refreshToken: newRefToken })
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
