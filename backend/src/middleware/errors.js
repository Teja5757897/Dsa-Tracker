const notFound = (req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({ message: err.message });
    }
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Request body is not valid JSON." });
    }
    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid id." });
    }

    console.error(err);
    res.status(err.status || 500).json({ message: "Something went wrong on the server." });
};

module.exports = { notFound, errorHandler };
