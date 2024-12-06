const express = require('express');
const router = express.Router();

router.post('/donation', addFoodListingToDonationHistory);
router.get('/donation', getAllDonationByRestaurantId);

module.exports = router;