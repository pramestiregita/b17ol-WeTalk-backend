const route = require('express').Router()
const messagesController = require('../controllers/messages')

route.post('/send', messagesController.sendMsg)
route.get('/all', messagesController.getAll)
route.get('/:id', messagesController.getMessage)

module.exports = route
