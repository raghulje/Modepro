exports.responseStatus = (res, statusCode, message, data = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message,
  };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

exports.successResponse = (res, message, data = null) =>
  exports.responseStatus(res, 200, message, data);

exports.createdResponse = (res, message, data = null) =>
  exports.responseStatus(res, 201, message, data);

exports.badRequestResponse = (res, message = 'Bad request') =>
  exports.responseStatus(res, 400, message);

exports.errorResponse = (res, message, statusCode = 500) =>
  exports.responseStatus(res, statusCode, message);

exports.notFoundResponse = (res, message = 'Resource not found') =>
  exports.responseStatus(res, 404, message);

exports.unauthorizedResponse = (res, message = 'Unauthorized') =>
  exports.responseStatus(res, 401, message);

exports.forbiddenResponse = (res, message = 'Forbidden') =>
  exports.responseStatus(res, 403, message);
