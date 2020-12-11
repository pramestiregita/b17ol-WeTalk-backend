
const admin = require('firebase-admin')

const serviceAccount = require('../config/wetalk-8b1a6-firebase-adminsdk-pxafg-f575eecfc0.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const notification = (deviceToken, sender, message) => {
  admin.messaging().send({
    token: deviceToken,
    notification: {
      title: sender,
      body: message
    }
  })
}

module.exports = notification
