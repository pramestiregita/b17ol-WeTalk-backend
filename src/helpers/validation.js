const yup = require('yup')

module.exports = {
  login: yup.object().shape({
    phoneNumber: yup.string().required('Please insert a number!')
  }),
  setProfile: yup.object().shape({
    name: yup.string().required('Please insert name!')
  }),
  sendMsg: yup.object().shape({
    content: yup.string().required('Please insert a content')
  })
}
