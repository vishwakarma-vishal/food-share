const express = require("express");
const router = express.Router();

router.post('/create', createFoodListing);
router.get('/all', getAllFoodListing);
router.put('/id/:id', updateFoodListingById);
router.delete('/id/:id', deleteFoodListingById);

module.exports = router;