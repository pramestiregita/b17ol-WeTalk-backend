const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const { APP_PORT } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

app.get('/', (req, res) => {
  res.status(200).send({
    success: true,
    message: 'Backend running'
  })
})

app.listen(APP_PORT, () => {
  console.log(`App listening to port ${APP_PORT}`)
})
