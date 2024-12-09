const express = require("express");
const router = express.Router();
const { ngoSignup, restaurantSignup, login, updateNgoProfile, updateRestaurantProfile } = require("../controllers/authController");

router.post('/ngo', ngoSignup);
router.post('/restaurant', restaurantSignup);
router.post('/login', login);

router.put('/ngo', updateNgoProfile);
router.put('/restaurant', updateRestaurantProfile);


module.exports = router;