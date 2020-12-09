const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {})
module.exports = io
const { APP_PORT } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

const { verifyAccessToken } = require('./middlewares/jwtHelpers')

const authRoute = require('./routes/auth')
const usersRoute = require('./routes/users')
const messagesRoute = require('./routes/messages')

app.use('/auth', authRoute)
app.use('/user', verifyAccessToken, usersRoute)
app.use('/message', verifyAccessToken, messagesRoute)

// provide static files
app.use('/upload', express.static('assets/uploads/'))

app.get('/', (req, res) => {
  return res.send({
    success: true,
    message: 'Backend is running'
  })
})

server.listen(APP_PORT, () => {
  console.log(`App listening to port ${APP_PORT}`)
})
