const bcrypt = require("bcrypt");
const Ngo = require('../models/Ngo');
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");
const { z } = require("zod");

ngoSignup = async (req, res) => {
    try {
        // Zod Schema
        const ngoSignupSchema = z.object({
            ngoName: z.string()
                .trim()
                .min(3, "NGO Name must be at least 3 characters")
                .max(100, "NGO Name cannot exceed 100 characters"),
            phone: z.string()
                .trim()
                .regex(/^[0-9]+$/, "Phone number must contain only digits")
                .min(10, "Phone number must be 10 digits")
                .max(10, "Phone number must be 10 digits"),
            email: z.string()
                .trim()
                .email("Invalid email format"),
            password: z.string()
                .trim()
                .min(5, "Password must be at least 5 characters")
                .max(30, "Password cannot exceed 30 characters"),
            city: z.string()
                .trim()
                .min(3, "City must be at least 3 characters")
                .max(50, "City cannot exceed 50 characters"),
            address: z.string()
                .trim()
                .min(3, "Address must be at least 3 characters")
                .max(200, "Address cannot exceed 200 characters"),
        });

        // validate and sanitize user input
        const sanitizedData = ngoSignupSchema.parse(req.body);

        let { ngoName, phone, email, password, city, address } = sanitizedData;

        const emailInNgo = await Ngo.findOne({ email: email });
        const emailInRestaurant = await Restaurant.findOne({ email: email });

        if (emailInNgo || emailInRestaurant) {
            return res.status(200).json({
                success: false,
                message: "Email already in use."
            });
        }

        // hashing password
        const hashedPassword = bcrypt.hashSync(password, 10);

        const ngo = new Ngo({ ngoName, phone, email, password: hashedPassword, city, address });
        const userInDb = await ngo.save();

        // generate jwt token
        const payload = { id: userInDb._id, role: userInDb.role };
        const token = jwt.sign(payload, process.env.JWT_NGO_SECRET, { expiresIn: '1h' });

        // creating safe user obj to send in response
        const safeUser = userInDb.toObject();

        // Rremoving unnecessary fileds
        delete safeUser.password;
        delete safeUser._id;
        delete safeUser.role;
        delete safeUser.__v;
        delete safeUser.createdAt;

        res.status(201).json({
            success: true,
            token: token,
            role: userInDb.role,
            safeUser,
            message: "Successfully signed up."
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // console.log(error.errors.map((err) => err.message));
            return res.status(400).json({
                success: false,
                message: "Invalid input. Please ensure all fields are correctly filled."
            });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong.",
        })
    }
}

restaurantSignup = async (req, res) => {
    try {
        // Zod Schema
        const restaurantSignupSchema = z.object({
            restaurantName: z.string()
                .trim()
                .min(3, "Restaurant Name must be at least 3 characters")
                .max(100, "Restaurant Name cannot exceed 100 characters"),
            phone: z.string()
                .trim()
                .regex(/^[0-9]+$/, "Phone number must contain only digits")
                .min(10, "Phone number must have 10 digits")
                .max(10, "Phone number must have 10 digits"),
            email: z.string()
                .trim()
                .email("Invalid email format"),
            password: z.string()
                .trim()
                .min(5, "Password must be at least 5 characters")
                .max(30, "Password cannot exceed 30 characters"),
            city: z.string()
                .trim()
                .min(3, "City must be at least 3 characters")
                .max(50, "City cannot exceed 50 characters"),
            address: z.string()
                .trim()
                .min(3, "Address must be at least 3 characters")
                .max(200, "Address cannot exceed 200 characters"),
        });

        // validate and sanitize user input
        const sanitizedData = restaurantSignupSchema.parse(req.body);

        const { restaurantName, phone, email, password, city, address } = sanitizedData;

        const emailInRestaurant = await Restaurant.findOne({ email: email });
        const emailInNgo = await Ngo.findOne({ email: email });

        if (emailInNgo || emailInRestaurant) {
            return res.status(200).json({
                success: false,
                message: "Email already in use."
            });
        }

        // hashing password
        const hashedpassword = bcrypt.hashSync(password, 10);

        const newRestaurant = new Restaurant({ restaurantName, phone, email, password: hashedpassword, city, address });
        const { _id, role } = await newRestaurant.save();

        // generate jwt token
        const payload = { id: _id, role: role };
        const token = jwt.sign(payload, process.env.JWT_RESTAURANT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            success: true,
            token: token,
            role: role,
            message: "Successfully signed up!"
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // console.log(error.errors.map((err) => err.message));
            return res.status(400).json({
                success: false,
                message: "Invalid input. Please ensure all fields are correctly filled."
            });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

login = async (req, res) => {
    try {
        //validate and sanitize input
        const loginSchema = z.object({
            email: z.string()
                .trim()
                .email("Invalid email format"),
            password: z.string()
                .trim()
                .min(5, "Password must be at least 5 characters")
                .max(30, "Password cannot exceed 20 characters"),
        });

        const sanitizedData = loginSchema.parse(req.body);

        const { email, password } = sanitizedData;
        const userInDb = await Ngo.findOne({ email }) || await Restaurant.findOne({ email });

        if (!userInDb) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        const passwordInDb = userInDb.password;
        const match = await bcrypt.compare(password, passwordInDb);

        if (match) {
            // generate token
            const payload = { id: userInDb._id, role: userInDb.role };

            const JWT_SECRET = userInDb.role === 'ngo' ? process.env.JWT_NGO_SECRET : process.env.JWT_RESTAURANT_SECRET;
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

            // creating safe user obj to send in response
            const userObject = userInDb.toObject();
            const { _id, role, password, __v, createdAt, ...safeUser } = userObject;

            return res.status(200).json({
                success: true,
                message: "Login successful",
                token: token,
                role: userInDb.role,
                safeUser
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            })
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log(error.errors.map((err) => err.message));
            return res.status(400).json({
                success: false,
                message: "Invalid input. Please ensure all fields are correctly filled."
            });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong."
        })
    }
}

module.exports = { ngoSignup, restaurantSignup, login }