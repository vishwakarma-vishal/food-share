const express = require("express");
const router = express.Router();
const { ngoSignup, restaurantSignup, login } = require("../controllers/authController");

router.post('/ngo', ngoSignup);
router.post('/restaurant', restaurantSignup);

router.post('/login', login);

module.exports = router;