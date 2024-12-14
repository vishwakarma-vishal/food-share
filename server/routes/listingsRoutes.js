const express = require("express");
const router = express.Router();
const { createFoodListing, getAllFoodListingOfRestaurant, updateFoodListingById, deleteFoodListingById } = require("../controllers/listingController");

// middleware to authenticate user
const authenticateRestaurant = require("../middleware/authenticateRestaurant");

router.post('/create', authenticateRestaurant, createFoodListing);
router.get('/', authenticateRestaurant, getAllFoodListingOfRestaurant);
router.put('/:id', authenticateRestaurant, updateFoodListingById);
router.delete('/:id', authenticateRestaurant, deleteFoodListingById);

module.exports = router;