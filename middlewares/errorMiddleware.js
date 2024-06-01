const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(404).json({
    status: err.status,
    message: err.message,
    data: null,
    error: err,
    stack: err.stack,
  });
};

module.exports = globalError;
