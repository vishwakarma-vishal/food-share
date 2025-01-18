const express = require("express");
const router = express.Router();
const { ngoSignup, restaurantSignup, login, authenticateToken, logout, refreshTokenHandler } = require("../controllers/authController");

router.post('/ngo', ngoSignup);
router.post('/restaurant', restaurantSignup);
router.post('/login', login);

router.post('/refresh', refreshTokenHandler);
router.post('/verify', authenticateToken);

router.post('/logout', logout);

module.exports = router;