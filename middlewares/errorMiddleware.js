const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.log(process.env.NODE_ENV);
  console.log(process.env.NODE_ENV === "development");
  if(process.env.NODE_ENV === "development"){
    sendErrorForDev(err, res);
  }
  else{
    sendErrorForProd(err, res);
  }

  
};

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}

module.exports = globalError;
