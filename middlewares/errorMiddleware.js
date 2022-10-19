const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Chack aboud the Mode to return the ERROR
  if (process.env.NODE_ENV === "development") {
    // DEV Mode
    sendErrorForDev(err, res);
  } else {
    // Prod Mode
    sendErrorForProd(err, res);
  }
};

// Send the ERROR in the development Mode.
const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Send the ERROR in the Production  Mode.
const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalError;
