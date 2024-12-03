const mongoose = require("mongoose");

const donationSchema = mongoose.Schema({
    image:{
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["veg", "non-veg"],
    },
    description: {
        type: String,
        required: true,
    },
    pickupNote: {
        type: String,
    },
    pickupFrom: {
        type: String,
    },
    pickupTill: {
        type: String,
    },
    Expiry: {
        type: Date,
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant", 
        required: true, 
    },
});

module.exports = mongoose.model("donation", donationSchema);