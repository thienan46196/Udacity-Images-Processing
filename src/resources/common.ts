export const Common = {
  not_found: {
    code: 'not_found',
    message: 'Not found!',
    status: 404
  },
  unauthorized: {
    code: 'unauthorized',
    message: 'The user is unauthorized! Please login!',
    status: 401
  },
  forbidden: {
    code: 'forbidden',
    message: 'The user has not had right privileges!',
    status: 403
  },
  server_error: {
    code: 'internal_server_error',
    message: 'Internal server error',
    status: 500
  },
  success: {
    code: 'ok',
    message: 'The request is successfully executed',
    status: 200
  }
};
