const bcrypt = require("bcrypt");
const Ngo = require('../models/Ngo');

ngoSignup = async(req, res) => {
    const { profileImg, ngoName, phone, email, password, about,
        foundingDate, city, address, createdAt } = req.body;

    if (!ngoName || !phone || !email || !password || !city) {
        res.status(200).json({
            success: true,
            message: "Please provide all the required info."
        })
    }

    // hashing password
    const hashedpassword = bcrypt.hashSync(password, 10);

    console.log(password);

    const ngo = new Ngo({profileImg, ngoName, phone, email, password: hashedpassword , about, foundingDate, city, address});
    await ngo.save();

    res.status(201).json({
        success: true,
        message: "Successfully signed up!"
    })
}

function restaurantSignup(req, res) {
    res.send("restaurant signup");
}

function login(req, res) {
    res.send("login");
}

module.exports = { ngoSignup, restaurantSignup, login }