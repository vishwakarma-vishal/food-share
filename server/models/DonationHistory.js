const mongoose = require("mongoose");

const donationHistorySchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    foodListingId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodListing', required: true, unique: true },
    status: { type: String, enum: ['collected', 'expired'], default: 'expired' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DonationHistory', donationHistorySchema);