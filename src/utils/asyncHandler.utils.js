const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next);
    } catch (error) {
    
        const statusCode = (error.code >= 100 && error.code <= 599) ? error.code : 500;
        
        res.status(statusCode).json({
            message: error.message,
            success: false
        });
    }
};

export { asyncHandler };


// another way
// const asyncHandler = (func) => {
//     return (req, res, next) => {
//         Promise.resolve(func(req, res, next)).catch(err => next(err));
//     }
// };

// export default asyncHandler;
    