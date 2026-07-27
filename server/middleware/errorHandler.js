export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  })
}

export const errorHandler = (error, req, res, next) => {
  console.error('❌ Request error:', {
    method: req.method,
    path: req.originalUrl,
    message: error.message,
    stack:
      process.env.NODE_ENV === 'development'
        ? error.stack
        : undefined
  })

  if (res.headersSent) {
    return next(error)
  }

  let statusCode = error.statusCode || error.status || 500
  let message = error.message || 'Internal server error.'

  // PostgreSQL unique constraint violation
  if (error.code === '23505') {
    statusCode = 409
    message = 'A record with this information already exists.'
  }

  // PostgreSQL foreign-key constraint violation
  if (error.code === '23503') {
    statusCode = 400
    message = 'A related database record could not be found.'
  }

  // PostgreSQL invalid input
  if (error.code === '22P02') {
    statusCode = 400
    message = 'One or more submitted values are invalid.'
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development'
      ? {
          errorCode: error.code || null,
          stack: error.stack
        }
      : {})
  })
}