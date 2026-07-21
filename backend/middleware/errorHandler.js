/**
 * Global Express Error Handler Middleware
 */
function errorHandler(err, req, res, next) {
  console.error("[Backend Error]:", err);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    error: err.name || "Internal Server Error",
    message: err.message || "An unexpected error occurred on the backend.",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
}

module.exports = errorHandler;
