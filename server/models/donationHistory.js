
const donationHistorySchema = mongoose.model({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    foodListingId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodListing', required: true },
    status: { type: String, enum: ['collected', 'expired'], default: 'expired' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DonationHistory', donationHistorySchema);