const express = require('express');
const router = express.Router();
const authenticateRestaurant = require('../middleware/authenticateRestaurant');
const { addListingToHistory, getDonationHistory } = require("../controllers/restaurantController");

router.post('/history', authenticateRestaurant, addListingToHistory);
router.get('/history', authenticateRestaurant, getDonationHistory);

module.exports = router;