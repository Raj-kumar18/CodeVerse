export const authorAndAdmin = (req, res, next) => {
    if (req.user.role !== "author" && req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to access this route"
        })
    }
    next()
}