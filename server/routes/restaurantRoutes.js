const express = require('express');
const router = express.Router();
const authenticateRestaurant = require('../middleware/authenticateRestaurant');
const { addListingToHistory, getDonationHistory, updateRestaurantProfile } = require("../controllers/restaurantController");

router.post('/history', authenticateRestaurant, addListingToHistory);
router.get('/history', authenticateRestaurant, getDonationHistory);
router.put('/profile', authenticateRestaurant, updateRestaurantProfile);

module.exports = router;