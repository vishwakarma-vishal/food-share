const mongoose = require("mongoose");

const RestaurantSchema = mongoose.Schema({
    profileImg: {
        type: String,
    },
    restaurantName: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    about: {
        type: String,
    },
    openFrom: {
        type: String,
    },
    openTill: {
        type: String,
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    donations: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "donation" 
    }]
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
