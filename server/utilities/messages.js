module.exports = {
  validator: {
    propertyIsRequired: '`{PATH}` is required.',
    minLength: 'The value of `{PATH}` (`{VALUE}`) is shorter than the minimum allowed',
    user: {
      password: 'Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character!',
      ageInterval: 'Age must be between 0 and 120',
      gender: 'Gender should be either "Male" or "Female".',
      role: '`{VALUE}` is not valid user role.'
    }
  },
  errors: {
    notFound: 'Error 404! I find your lack of navigation disturbing...',
    authentication: 'Authentication error!',
    invalidCredentials: 'Invalid Credentials!',
    passwordsNotMatch: 'Passwords do not match.'
  },
  auth: {
    productAlreadyBought: 'Product was already bought!',
    cantEdit: 'You do not have rights to edit this product!',
    cantDelete: 'You do not have rights to delete this product!'
  }
}
