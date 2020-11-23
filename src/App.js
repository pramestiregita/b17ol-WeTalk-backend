const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const { APP_PORT } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

const authMiddleware = require('./middlewares/auth')

const authRoute = require('./routes/auth')
const usersRoute = require('./routes/users')
const messagesRoute = require('./routes/messages')

app.use('/auth', authRoute)
app.use('/user', authMiddleware, usersRoute)
app.use('/message', authMiddleware, messagesRoute)

// provide static files
app.use('/upload', express.static('assets/uploads/'))

app.listen(APP_PORT, () => {
  console.log(`App listening to port ${APP_PORT}`)
})
