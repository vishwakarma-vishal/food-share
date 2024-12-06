const express = require("express");
const router = express.Router();

router.post('/ngo', ngoSignup);
router.post('/restaurant', restaurantSignup);

router.post('/login', loginUser);

module.exports = router;