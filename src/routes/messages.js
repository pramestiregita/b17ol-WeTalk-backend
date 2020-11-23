const route = require('express').Router()
const messagesController = require('../controllers/messages')

route.post('/send', messagesController.sendMsg)

module.exports = route
