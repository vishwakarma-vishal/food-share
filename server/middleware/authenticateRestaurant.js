const jwt = require("jsonwebtoken");

const authenticateRestaurant = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Authorization token is required."
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_RESTAURANT_SECRET);

        // Attach the payload restaurant id to req
        req.restaurantId = payload.id;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
}

module.exports = authenticateRestaurant;