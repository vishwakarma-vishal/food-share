const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { addListingToCollection } = require('../controllers/ngoController');

// middleware to authorize user
const authenticate = (req, res, next) => {
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

        if (payload.role !== 'ngo') {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }
        // Attach the payload restaurant id to req
        req.ngoId = payload.id;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token."
            
        });
    }
}

router.post('/reserve', authenticate, addListingToCollection);
// router.post('/distribution-history', addFoodListing_to_Distribution_History);

// router.get('/collection-history', getAll_Collection_ByNgoId);
// router.get('/distribution-history', getAll_Collection_ByNgoId);

module.exports = router;
