const express = require("express");
const router = express.Router();
const { ngoSignup, restaurantSignup, login, authenticateToken, logout, refreshTokenHandler, forgetPassword, resetPassword } = require("../controllers/authController");

router.post('/ngo', ngoSignup);
router.post('/restaurant', restaurantSignup);
router.post('/login', login);

router.post('/refresh', refreshTokenHandler);
router.post('/verify', authenticateToken);

router.post('/logout', logout);

router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;