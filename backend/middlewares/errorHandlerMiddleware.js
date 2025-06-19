const errorHandler=(err, req, res, next) => {
    const statusCode = res.statusCode ===200 ? 500 : res.statusCode; 
    res.status(statusCode);
    res.json({
         message: err.message || 'Something went wrong',
         stack:err.stack || 'No stack trace available',
    });
};

module.exports = errorHandler;