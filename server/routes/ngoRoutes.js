const express = require("express");
const router = express.Router();

router.post('/collection-history', addFoodListing_to_Collection_History);
router.post('/distribution-history', addFoodListing_to_Distribution_History);

router.get('/collection-history', getAll_Collection_ByNgoId);
router.get('/distribution-history', getAll_Collection_ByNgoId);