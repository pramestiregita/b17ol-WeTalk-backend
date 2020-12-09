const { Users } = require('../models')

const response = require('../helpers/response')
const { login: loginSchema, reLogin: refreshTokenSchema } = require('../helpers/validation')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../middlewares/jwtHelpers')

module.exports = {
  login: async (req, res) => {
    try {
      const { phoneNumber } = await loginSchema.validate(req.body)
      const [find, created] = await Users.findOrCreate({ where: { phoneNumber } })

      if (find || created) {
        const token = await signAccessToken(find.id)
        const refreshToken = await signRefreshToken(find.id)

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
