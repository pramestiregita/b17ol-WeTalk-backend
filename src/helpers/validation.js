const yup = require('yup')

module.exports = {
  login: yup.object().shape({
    phoneNumber: yup.string().required('Please insert a number!')
  }),
  reLogin: yup.object().shape({
    refreshToken: yup.string().required('Please insert a refresh token!')
  }),
  setProfile: yup.object().shape({
    name: yup.string(),
    email: yup.string().email('Please insert a valid email!')
  }),
  sendMsg: yup.object().shape({
    content: yup.string().required('Please insert a message!')
  })
}
