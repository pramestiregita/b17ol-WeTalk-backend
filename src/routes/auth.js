const route = require('express').Router()
const authControllers = require('../controllers/auth')

route.post('/login', authControllers.login)
route.post('/refresh-token', authControllers.reLogin)

module.exports = route
