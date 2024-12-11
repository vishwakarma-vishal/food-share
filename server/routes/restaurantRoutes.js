const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { addListingToHistory } = require("../controllers/restaurantController");

// middleware to authorize user
const authenticateRole = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Authorization token is required."
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (payload.role !== 'restaurant') {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }
        // Attach the payload restaurant id to req
        req.restaurantId = payload.id;
        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
}

router.post('/history', authenticateRole, addListingToHistory);
// router.get('/donation', getAllDonationByRestaurantId);

module.exports = router;