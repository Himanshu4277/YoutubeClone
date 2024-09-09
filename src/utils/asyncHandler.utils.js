const asyncHandler = (func) => async (res, req, next) => {
    try {
        await func(res, req, next)
    } catch (error) {
        res.status(error.code || 500).json({
            message: error.message,
            success: false
        })
    }
}
export { asyncHandler }

// another way
// const asyncHandler = (func) => {
//     return (req, res, next) => {
//         Promise.resolve(func(req, res, next)).catch(err => next(err));
//     }
// };

// export default asyncHandler;
    