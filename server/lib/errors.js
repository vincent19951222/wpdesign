class ApiError extends Error {
  constructor(code, message, options = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = options.statusCode || 500;
    this.details = options.details || null;
  }
}

function toErrorResponse(error) {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      body: {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown server error',
        details: null,
      },
    },
  };
}

module.exports = {
  ApiError,
  toErrorResponse,
};
