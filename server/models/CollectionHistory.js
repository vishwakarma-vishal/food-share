const mongoose = require("mongoose");

const collectionHistorySchema = new mongoose.Schema({
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ngo', required: true
    },
    foodListingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodListing', required: true
    },
    collectedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('CollectionHistory', collectionHistorySchema);