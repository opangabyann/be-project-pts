const errorHandler = (err, req, res, next) => {
  console.log(err)
    res.status(500).json({
      status: 'error',
      message: 'terjadi kesalahan pada server',
      err: err
    });
  };
  
  module.exports = errorHandler;