const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(err => {
            res.status(500).json({ message: 'Internal Server Error', errors: err.errors });
        })
    }
}

export default asyncHandler;