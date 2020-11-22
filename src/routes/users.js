const route = require('express').Router()
const usersControllers = require('../controllers/users')

route.post('/login', usersControllers.login)

module.exports = route
