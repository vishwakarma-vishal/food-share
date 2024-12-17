const mongoose = require("mongoose");

const ngoSchema = mongoose.Schema({
    profileImg: { type: String },
    imgPublicId: {type: String},
    ngoName: { type: String, required: true },
    role: {type: String, default: "ngo"},
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    about: { type: String },
    foundingDate: { type: Date },
    city: { type: String, required: true },
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ngo", ngoSchema);
