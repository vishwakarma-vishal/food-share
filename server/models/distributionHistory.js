
const distributionHistorySchema = mongoose.model({
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'ngo', required: true },
    foodListingId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodListing', required: true },
    quantityDistributed: {type: Number},
    notes: {type: String},
})

module.exports = mongoose.model('DistributionHistory', distributionHistorySchema);