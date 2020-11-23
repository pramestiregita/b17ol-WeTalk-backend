const route = require('express').Router()
const messagesController = require('../controllers/messages')

route.post('/send', messagesController.sendMsg)
route.get('/all', messagesController.getAll)

module.exports = route
