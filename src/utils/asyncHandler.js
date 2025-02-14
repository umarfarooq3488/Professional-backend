const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(err => {
            res.status(500).json({ error: 'Internal Server Error', err });
        })
    }
}

export { asyncHandler }