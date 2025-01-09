const express = require("express");
const router = express.Router();
const authenticateNgo = require("../middleware/authenticateNgo");
const { addListingToCollection, getCollectionHistory, getAllFoodListing, updateNgoProfile, addToDistributionHistory, getDistributionHistory } = require('../controllers/ngoController');

router.post('/reserve', authenticateNgo, addListingToCollection);
router.get('/all', authenticateNgo, getAllFoodListing);
router.get('/collection', authenticateNgo, getCollectionHistory);
router.put('/profile', authenticateNgo, updateNgoProfile);

router.post('/distribution-history', authenticateNgo, addToDistributionHistory);
router.get('/distribution-history',authenticateNgo, getDistributionHistory);

module.exports = router;
