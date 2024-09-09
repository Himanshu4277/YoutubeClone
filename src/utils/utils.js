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
// const assync = (func) => (req, res, next) => {
//     return Promise.resolve(func(req, res, next)).catch(err => next(err));
// };

// export default assync;
