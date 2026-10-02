function notFoundHandler(request, response) {
  response.status(404).json({ error: `Route ${request.method} ${request.originalUrl} not found` })
}

function errorHandler(error, _request, response, next) {
  if (response.headersSent) {
    return next(error)
  }

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.code === 11000) {
    return response.status(409).json({ error: 'A record with this value already exists' })
  }

  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'Request body must contain valid JSON' })
  }

  if (error.type === 'entity.too.large') {
    return response.status(413).json({ error: 'Request body must be smaller than 1 MB' })
  }

  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500
  const message = statusCode >= 500 ? 'Internal server error' : error.message
  return response.status(statusCode).json({ error: message })
}

module.exports = { errorHandler, notFoundHandler }