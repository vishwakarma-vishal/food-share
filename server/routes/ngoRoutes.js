const express = require("express");
const router = express.Router();
const { addListingToCollection, getCollectionHistory, getAllFoodListing } = require('../controllers/ngoController');
const authenticateNgo = require("../middleware/authenticateNgo");

router.post('/reserve', authenticateNgo, addListingToCollection);
router.get('/all', authenticateNgo, getAllFoodListing);
router.get('/collection', authenticateNgo, getCollectionHistory);

// router.post('/distribution-history', addFoodListing_to_Distribution_History);
// router.get('/distribution-history', getAll_Collection_ByNgoId);

module.exports = router;
