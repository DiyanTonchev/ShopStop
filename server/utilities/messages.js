module.exports = {
  validator: {
    propertyIsRequired: '`{PATH}` is required.',
    minLength: 'The value of `{PATH}` (`{VALUE}`) is shorter than the minimum allowed',
    user: {
      ageInterval: 'Age must be between 0 and 120',
      gender: 'Gender should be either "Male" or "Female".',
      role: '`{VALUE}` is not valid user role.'
    }
  },
  error: {
    notFound: 'Error 404! I find your lack of navigation disturbing...'
  }
}
