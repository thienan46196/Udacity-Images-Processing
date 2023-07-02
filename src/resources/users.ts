export const UserResources = {
  user_is_not_exists: {
    code: 'user_is_not_exists',
    message: 'User is not exists',
    status: 404
  },

  //400
  user_is_exists: {
    code: 'user_is_exists',
    message: 'User is not exists',
    status: 400
  },
  wrong_password: {
    code: 'wrong_password',
    message: 'Wrong password',
    status: 400
  },
  token_is_invalid: {
    code: 'token_is_invalid',
    message: 'Token is invalid',
    status: 400
  },

  //200
  login_successfully: {
    code: 'login_successfully',
    message: 'User logged in successfully',
    status: 200
  },
  user_is_created: {
    code: 'user_is_created',
    message: 'User is created successfully!',
    status: 201
  },
  token_is_valid: {
    code: 'token_is_valid',
    message: 'Token is valid',
    status: 200
  }
};
