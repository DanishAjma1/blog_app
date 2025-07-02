const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500; // Default to 500 if statusCode is not set
    let message = err.message || 'Internal Server Error'; // Default message if not provided
    
    console.log(err); 
    res.status(statusCode).json({
        status: err.status || 'error', 
        message: message,
        success: false,
    })
}
module.exports = errorHandler;