// Centralized Error Handling Middleware
function errorHandler(err, req, res, next) {
  console.error('[Error Logger]', {
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server.',
    errors: err.errors || null,
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler;
