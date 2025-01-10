const mongoose = require('mongoose');

const FoodListingSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    imageUrl: { type: String },
    imgPublicId: { type: String },
    title: { type: String, required: true },
    category: { type: String, enum: ['veg', 'non-veg'], required: true },
    description: { type: String },
    deliveryNote: { type: String },
    expiry: { type: Date, required: true },
    pickupFrom: { type: String, required: true },
    pickupTill: { type: String, required: true },
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo' },
    reservedAt: { type: Date },
    status: { type: String, enum: ['available', 'reserved', 'collected', 'expired', 'distributed'], default: 'available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoodListing', FoodListingSchema);
