const mongoose = require('mongoose');

const FoodListingSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, enum: ['vegetarian', 'non-vegetarian'], required: true },
    pickupTime: { type: Date, required: true },
    description: { type: String, required: true },
    deliveryNote: { type: String },
    expiry: { type: Date, required: true },
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo' },
    reservedAt: { type: Date },
    status: { type: String, enum: ['available', 'reserved', 'collected', 'expired'], default: 'available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoodListing', FoodListingSchema);
