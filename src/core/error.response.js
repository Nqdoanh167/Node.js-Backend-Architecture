'use strict';

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
module.exports={
  ConflictRequestError,
  BadRequestError
}