'use strict';
const { ReasonPhrases, StatusCodes } = require('../utils/httpStatusCode');

const StatusCode = {
  FORDIDDEN: 403,
  CONFLICT: 409,
};

const ReasonStatusCode = {
  FORDIDDEN: 'bad request error',
  CONFLICT: 'conflict error',
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT,
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORDIDDEN,
    statusCode = StatusCode.FORDIDDEN,
  ) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED,
  ) {
    super(message, statusCode);
  }
}
module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
};
