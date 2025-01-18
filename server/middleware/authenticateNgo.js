const jwt = require("jsonwebtoken");

const authenticateNgo = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Authorization token is required."
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_NGO_SECRET);

        // Attach the payload restaurant id to req
        req.ngoId = payload.id;
        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
}

module.exports = authenticateNgo;