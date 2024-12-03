const mongoose = require("mongoose");

const ngoSchema = mongoose.Schema({
    profileImg: {
        type: String,
    },
    ngoName: {
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
    foundingDate : {
        type: Date
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    collection: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "donation" 
    }],
    distribution: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "distibution" 
    }]
});

module.exports = mongoose.model("ngo", ngoSchema);
