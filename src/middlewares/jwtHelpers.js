const jwt = require('jsonwebtoken')
const response = require('../helpers/response')
const { SECRET_KEY, REFRESH_KEY, SECRET_TOKEN_EXP, REFRESH_TOKEN_EXP } = process.env

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = { userId }
      const secret = SECRET_KEY
      const option = { expiresIn: SECRET_TOKEN_EXP }

      jwt.sign(payload, secret, option, (err, token) => {
        if (err) return reject(new Error('Internal Server Error'))

        resolve(token)
      })
    })
  },
  verifyAccessToken: (req, res, next) => {
    const { authorization } = req.headers

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.slice(7, authorization.length)

      jwt.verify(token, SECRET_KEY, (err, payload) => {
        if (err) return response(res, 'Unauthorized', {}, 401, false)

        req.user = payload
        next()
      })
    } else {
      return response(res, 'Forbidden Access', {}, 403, false)
    }
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = { userId }
      const secret = REFRESH_KEY
      const option = { expiresIn: REFRESH_TOKEN_EXP }

      jwt.sign(payload, secret, option, (err, token) => {
        if (err) return reject(new Error('Internal Server Error'))

        resolve(token)
      })
    })
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, REFRESH_KEY, (err, payload) => {
        if (err) return reject(new Error('Unauthorized'))

        const userId = payload.id
        resolve(userId)
      })
    })
  }
}
