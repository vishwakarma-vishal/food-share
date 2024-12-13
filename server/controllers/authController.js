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
                .min(10, "Phone number must be at least 10 digits")
                .max(15, "Phone number cannot exceed 15 digits"),
            email: z.string()
                .trim()
                .email("Invalid email format"),
            password: z.string()
                .trim()
                .min(6, "Password must be at least 6 characters")
                .max(100, "Password cannot exceed 100 characters"),
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
        const { _id, role } = await ngo.save();

        // generate jwt token
        const payload = { id: _id, role: role }
        const token = jwt.sign(payload, process.env.JWT_NGO_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            success: true,
            token: token,
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
                .min(10, "Phone number must be at least 10 digits")
                .max(15, "Phone number cannot exceed 15 digits"),
            email: z.string()
                .trim()
                .email("Invalid email format"),
            password: z.string()
                .trim()
                .min(6, "Password must be at least 6 characters")
                .max(100, "Password cannot exceed 100 characters"),
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
                .min(6, "Password must be at least 6 characters")
                .max(100, "Password cannot exceed 100 characters"),
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

// update ngo profile
updateNgoProfile = async (req, res) => {
    try {
        const updateNgoProfileSchema = z.object({
            ngoName: z.string()
                .trim()
                .min(3, "NGO Name must be at least 3 characters")
                .max(100, "NGO Name cannot exceed 100 characters")
                .optional(),
            about: z.string()
                .trim()
                .min(6, "About must be at least 6 characters")
                .max(100, "About cannot exceed 100 characters")
                .optional(),
            foundingDate: z.string()
                .trim()
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Founding Date must be in YYYY-MM-DD format")
                .optional(),
            city: z.string()
                .trim()
                .min(3, "City must be at least 3 characters")
                .max(50, "City cannot exceed 50 characters")
                .optional(),
            address: z.string()
                .trim()
                .min(3, "Address must be at least 3 characters")
                .max(200, "Address cannot exceed 200 characters")
                .optional(),
        });

        const sanitizedData = updateNgoProfileSchema.parse(req.body);

        const { ngoName, about, foundingDate, city, address } = sanitizedData;
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required."
            });
        }
        const token = authHeader.split(' ')[1];

        const payload = jwt.verify(token, process.env.JWT_NGO_SECRET);
        const id = payload.id;
        const userInDb = await Ngo.findById(id);

        if (!userInDb) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        const updatedFields = {
            ngoName: ngoName !== undefined ? ngoName : userInDb.ngoName,
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
            message: "User updated"
        })

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
        })
    }
}

// update restaurant profile
updateRestaurantProfile = async (req, res) => {
    try {
        const updateRestaurantProfileSchema = z.object({
            restaurantName: z.string()
                .trim()
                .min(3, "Restaurant Name must be at least 3 characters")
                .max(100, "Restaurant Name cannot exceed 100 characters")
                .optional(),
            about: z.string()
                .trim()
                .min(6, "About must be at least 6 characters")
                .max(100, "About cannot exceed 100 characters")
                .optional(),
            openFrom: z.string()
                .trim()
                .regex(/^(0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/, "Invalid time format")
                .optional(),
            openTill: z.string()
                .trim()
                .regex(/^(0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/, "Invalid time format")
                .optional(),
            city: z.string()
                .trim()
                .min(3, "City must be at least 3 characters")
                .max(50, "City cannot exceed 50 characters")
                .optional(),
            address: z.string()
                .trim()
                .min(3, "Address must be at least 3 characters")
                .max(200, "Address cannot exceed 200 characters")
                .optional(),
        });

        const sanitizedData = updateRestaurantProfileSchema.parse(req.body);

        const { restaurantName, about, openFrom, openTill, city, address } = sanitizedData;

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required."
            });
        }
        const token = authHeader.split(' ')[1];

        const payload = jwt.verify(token, process.env.JWT_RESTAURANT_SECRET);
        const id = payload.id;
        const userInDb = await Restaurant.findById(id);

        if (!userInDb) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        const updatedFields = {
            restaurantName: restaurantName !== undefined ? restaurantName : userInDb.restaurantName,
            about: about !== undefined ? about : userInDb.about,
            openFrom: openFrom !== undefined ? openFrom : userInDb.openFrom,
            openTill: openTill !== undefined ? openTill : userInDb.openTill,
            city: city !== undefined ? city : userInDb.city,
            address: address !== undefined ? address : userInDb.address,
        };

        const updatedUserInDb = await Restaurant.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });

        res.status(200).json({
            success: true,
            message: "User updated"
        })

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
        })
    }
}

module.exports = { ngoSignup, restaurantSignup, login, updateNgoProfile, updateRestaurantProfile }