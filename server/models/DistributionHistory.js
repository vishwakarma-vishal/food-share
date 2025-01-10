const mongoose = require("mongoose");

const distributionHistorySchema = new mongoose.Schema({
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo', required: true },
    foodListingId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodListing', required: true },
    distributionNote: {type: String},
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('DistributionHistory', distributionHistorySchema);