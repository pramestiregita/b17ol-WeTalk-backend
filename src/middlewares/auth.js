const response = require('../helpers/response')
const jwt = require('jsonwebtoken')

const { SECRET_KEY } = process.env

module.exports = (req, res, next) => {
  const { authorization } = req.headers

  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.slice(7, authorization.length)

    try {
      const verify = jwt.verify(token, SECRET_KEY)

      if (verify) {
        req.user = verify
        next()
      } else {
        return response(res, 'Unauthoraized', {}, 401, false)
      }
    } catch (err) {
      return response(res, err.message, {}, 500, false)
    }
  } else {
    return response(res, 'Forbidden Access', {}, 403, false)
  }
}
