const route = require('express').Router()
const usersControllers = require('../controllers/users')

route.get('/profile', usersControllers.getProfile)
route.get('/friend', usersControllers.getFriends)
route.get('/friend/profile/:id', usersControllers.getFriend)
route.patch('/set-profile', usersControllers.setProfile)
route.patch('/update-ava', usersControllers.updateAva)

module.exports = route
