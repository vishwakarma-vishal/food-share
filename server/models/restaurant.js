const mongoose = require("mongoose");

const RestaurantSchema = mongoose.Schema({
    profileImg: { type: String },
    restaurantName: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    about: { type: String },
    openFrom: { type: String, },
    openTill: { type: String },
    city: { type: String, required: true },
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
