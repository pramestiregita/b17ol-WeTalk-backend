const { Users } = require('../models')

const response = require('../helpers/response')
const { login: loginSchema } = require('../helpers/validation')

module.exports = {
  login: async (req, res) => {
    try {
      const { phoneNumber } = await loginSchema.validate(req.body)
      const find = await Users.findAll({ where: { phoneNumber } })
      console.log(find)
      if (!find.length) {
        const create = await Users.create({ phoneNumber })
        if (create) {
          return response(res, 'Login succesfully', { data: create })
        } else {
          return response(res, 'Failed to login', {}, 400, false)
        }
      } else {
        return response(res, 'Login succesfully', { data: phoneNumber })
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
