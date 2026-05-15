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
