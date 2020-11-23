const route = require('express').Router()
const usersControllers = require('../controllers/users')

route.patch('/set-profile/:id', usersControllers.setProfile)

module.exports = route