const yup = require('yup')

module.exports = {
  login: yup.object().shape({
    phoneNumber: yup.number().typeError('Must be a number').required('Please insert a number!')
  }),
  setProfile: yup.object().shape({
    name: yup.string().required('Please insert name!')
  }),
  sendMsg: yup.object().shape({
    recipientId: yup.number().typeError('Please insert recipientId').required('Please insert recipientId'),
    content: yup.string().required('Please insert a content')
  })
}
