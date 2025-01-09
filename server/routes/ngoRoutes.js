const express = require("express");
const router = express.Router();
const { addListingToCollection, getCollectionHistory, getAllFoodListing, updateNgoProfile, addToDistributionHistory } = require('../controllers/ngoController');
const authenticateNgo = require("../middleware/authenticateNgo");

router.post('/reserve', authenticateNgo, addListingToCollection);
router.get('/all', authenticateNgo, getAllFoodListing);
router.get('/collection', authenticateNgo, getCollectionHistory);
router.put('/profile', authenticateNgo, updateNgoProfile);

router.post('/distribution-history', authenticateNgo, addToDistributionHistory);
// router.get('/distribution-history', getDistributionHistory);

module.exports = router;
