const yup = require('yup')

module.exports = {
  login: yup.object().shape({
    phoneNumber: yup.number().typeError('Must be a number').required('Please insert a number!')
  }),
  setProfile: yup.object().shape({
    name: yup.string().required('Please insert name!')
  })
}
