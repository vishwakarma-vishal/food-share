const bcrypt = require("bcrypt");
const Ngo = require('../models/Ngo');
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");

ngoSignup = async (req, res) => {
    const { ngoName, phone, email, password, city, address } = req.body;

    if (!ngoName || !phone || !email || !password || !city || !address) {
        return res.status(200).json({
            success: false,
            message: "Please provide all the required info."
        });
    }

    const emailInNgo = await Ngo.findOne({ email: email });
    const emailInRestaurant = await Restaurant.findOne({ email: email });

    if (emailInNgo || emailInRestaurant) {
        return res.status(200).json({
            success: false,
            message: "Email already in use."
        });
    }

    try {
        // hashing password
        const hashedPassword = bcrypt.hashSync(password, 10);

        const ngo = new Ngo({ ngoName, phone, email, password: hashedPassword, city, address });
        const { _id, role } = await ngo.save();

        // generate jwt token
        const payload = { id: _id, role: role }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            success: true,
            token: token,
            message: "Successfully signed up!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
        })
    }
}

restaurantSignup = async (req, res) => {
    const { restaurantName, phone, email, password, city, address } = req.body;

    if (!restaurantName || !phone || !email || !password || !city || !address) {
        return res.status(200).json({
            success: false,
            message: "Please provide all the required info."
        });
    }

    const emailInRestaurant = await Restaurant.findOne({ email: email });
    const emailInNgo = await Ngo.findOne({ email: email });

    if (emailInNgo || emailInRestaurant) {
        return res.status(200).json({
            success: false,
            message: "Email already in use."
        });
    }

    try {
        // hashing password
        const hashedpassword = bcrypt.hashSync(password, 10);

        const newRestaurant = new Restaurant({ restaurantName, phone, email, password: hashedpassword, city, address });
        const { _id, role } = await newRestaurant.save();

        // generate jwt token
        const payload = { id: _id, role: role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            success: true,
            token: token,
            message: "Successfully signed up!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

login = async (req, res) => {
    const { email, password } = req.body;
    const userInDb = await Ngo.findOne({ email }) || await Restaurant.findOne({ email });

    if (!userInDb) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        })
    }

    try {
        const passwordInDb = userInDb.password;
        const match = await bcrypt.compare(password, passwordInDb);

        if (match) {
            // generate token
            const payload = { id: userInDb._id, role: userInDb.role };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({
                success: true,
                message: "Login successful",
                token: token,
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            })
        }
    } catch (err) {
        console.log("error->", err);
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        })
    }
}

// update ngo profile
updateNgoProfile = async (req, res) => {
    const { profileImg, ngoName, phone, email, about, foundingDate, city, address } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Authorization token is required."
        });
    }
    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const id = payload.id;
        const userInDb = await Ngo.findById(id);

        if (!userInDb) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        const updatedFields = {
            profileImg: profileImg !== undefined ? profileImg : userInDb.profileImg,
            ngoName: ngoName !== undefined ? ngoName : userInDb.ngoName,
            phone: phone !== undefined ? phone : userInDb.phone,
            email: email !== undefined ? email : userInDb.email,
            about: about !== undefined ? about : userInDb.about,
            foundingDate: foundingDate !== undefined ? foundingDate : userInDb.foundingDate,
            city: city !== undefined ? city : userInDb.city,
            address: address !== undefined ? address : userInDb.address,
        };

        const updatedUserInDb = await Ngo.findByIdAndUpdate(
            id,
            { $set: updatedFields }, // Use $set for partial updates
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "User updated",
            updatedUserInDb
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            err
        })
    }
}

// update restaurant profile
updateRestaurantProfile = async (req, res) => {
    const { profileImg, restaurantName, phone, email, about, openFrom, openTill, city, address } = req.body;

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Authorization token is required."
        });
    }
    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const id = payload.id;
        const userInDb = await Restaurant.findById(id);

        if (!userInDb) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        const updatedFields = {
            profileImg: profileImg !== undefined ? profileImg : userInDb.profileImg,
            restaurantName: restaurantName !== undefined ? restaurantName : userInDb.restaurantName,
            phone: phone !== undefined ? phone : userInDb.phone,
            email: email !== undefined ? email : userInDb.email,
            about: about !== undefined ? about : userInDb.about,
            openFrom: openFrom !== undefined ? openFrom : userInDb.openFrom,
            openTill: openTill !== undefined ? openTill : userInDb.openTill,
            city: city !== undefined ? city : userInDb.city,
            address: address !== undefined ? address : userInDb.address,
        };

        const updatedUserInDb = await Restaurant.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });

        res.status(200).json({
            success: true,
            message: "User updated",
            updatedUserInDb
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            err
        })
    }
}

module.exports = { ngoSignup, restaurantSignup, login, updateNgoProfile, updateRestaurantProfile }