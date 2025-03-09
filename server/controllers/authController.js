const bcrypt = require("bcrypt");
const Ngo = require("../models/Ngo");
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");
const { z } = require("zod");
const nodemailer = require("nodemailer");
const { google } = require('googleapis');

ngoSignup = async (req, res) => {
    try {
        // Zod Schema
        const ngoSignupSchema = z.object({
            name: z.string()
                .trim()
                .min(5, "NGO Name must be at least 5 characters")
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
                .min(5, "Address must be at least 5 characters")
                .max(200, "Address cannot exceed 200 characters"),
        });

        // validate and sanitize user input
        const sanitizedData = ngoSignupSchema.parse(req.body);

        let { name, phone, email, password, city, address } = sanitizedData;

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

        const ngo = new Ngo({ name, phone, email, password: hashedPassword, city, address });
        const userInDb = await ngo.save();

        // generate jwt token
        const payload = { id: userInDb._id, role: userInDb.role };
        const token = jwt.sign(payload, process.env.JWT_NGO_SECRET, { expiresIn: '1m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Store refresh token in an HTTP-only secure cookie
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

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
            name: z.string()
                .trim()
                .min(5, "Restaurant Name must be at least 5 characters")
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
                .min(5, "Address must be at least 5 characters")
                .max(200, "Address cannot exceed 200 characters"),
        });

        // validate and sanitize user input
        const sanitizedData = restaurantSignupSchema.parse(req.body);

        const { name, phone, email, password, city, address } = sanitizedData;

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

        const newRestaurant = new Restaurant({ name, phone, email, password: hashedpassword, city, address });
        const userInDb = await newRestaurant.save();

        // generate jwt token
        const payload = { id: userInDb._id, role: userInDb.role };
        const token = jwt.sign(payload, process.env.JWT_RESTAURANT_SECRET, { expiresIn: '1m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        // creating safe user obj to send in response
        const safeUser = userInDb.toObject();

        // Removing unnecessary fileds
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
            const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1m' });
            const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

            // Store refresh token in an HTTP-only secure cookie
            const isProduction = process.env.NODE_ENV === "production";

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,  // Ensures the cookie can't be accessed by JavaScript
                secure: isProduction,  // Only set 'secure' in production (requires HTTPS)
                sameSite: isProduction ? "None" : "Lax",  // 'None' for cross-site cookies in production, 'Lax' for local dev
                maxAge: 7 * 24 * 60 * 60 * 1000,  // Cookie expires in 7 days
                path: "/",  // Accessible on the entire site
            });

            // creating safe user obj to send in response
            const userObject = userInDb.toObject();
            const { _id, role, password, __v, createdAt, ...safeUser } = userObject;

            return res.status(200).json({
                success: true,
                message: "Login successful",
                accessToken,
                role: userInDb.role,
                safeUser,
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

authenticateToken = (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({
            success: false,
            message: "Authorization token is required."
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Try decoding with NGO secret
        const decodedNgoToken = jwt.verify(token, process.env.JWT_NGO_SECRET);
        if (decodedNgoToken) {
            return res.status(200).json({
                isValid: true,
                role: decodedNgoToken.role,
            });
        } else {
            const decodedRestaurantToken = jwt.verify(token, process.env.JWT_RESTAURANT_SECRET);
            return res.status(200).json({
                isValid: true,
                role: decodedRestaurantToken.role
            });
        }
    } catch (errRestaurant) {
        return res.status(401).json({
            isValid: false,
            message: "Invalid or expired token",
        });
    }
};

logout = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        path: "/",
    });

    return res.status(200).json({
        message: 'Logged out successfully'
    });
};

refreshTokenHandler = (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh token is required."
        });
    }

    try {
        // Verify the refresh token
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Generate a new access token
        const secret = payload.role === "ngo" ? process.env.JWT_NGO_SECRET : process.env.JWT_RESTAURANT_SECRET;
        const newAccessToken = jwt.sign(
            { id: payload.id, role: payload.role },
            secret,
            { expiresIn: "1m" } // Access token expiry
        );

        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Refresh token expired. Please log in again."
            });
        }

        res.status(401).json({
            success: false,
            message: "Invalid refresh token. Please log in again."
        });
    }
};

forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const ngoUserInDb = await Ngo.findOne({ email });
        const restaurantUserInDb = await Restaurant.findOne({ email });

        if (!ngoUserInDb && !restaurantUserInDb) {
            return res.status(404).json({
                success: false,
                message: "User does not exist",
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        // token
        const role = ngoUserInDb ? "ngo" : "restaurant";
        const token = jwt.sign({ email, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "15m" });

        const FRONTEND_URL = process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173";
        const link = `${FRONTEND_URL}/reset-password/${token}`;

        // Email options
        const mailOptions = {
            from: `"Food Share" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "🔒 Reset Your Password | Food Share",
            text: `Hello,

                    We received a request to reset your password for your Food Share account. 
                    Click the link below to reset your password. This link is valid for only 15 minutes.

                    Reset Password: ${link}

                    If you did not request this, please ignore this email.

                    Best regards,  
                    Food Share Team`,
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color:#22C55E;">🔒 Reset Your Password</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password for your Food Share account.</p>
                <p><strong>Click the button below to reset your password.</strong></p>
                <p style="text-align: left;">
                    <a href="${link}" target="_blank" 
                       style="background:#22C55E; color: white; padding: 10px 20px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                       Reset Password
                    </a>
                </p>
                <p>This link is valid for <strong>15 minutes</strong>. If you did not request this, please ignore this email.</p>
                <p>Best regards,<br><strong>Food Share Team</strong></p>
            </div>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Password reset email has been sent."
        });

    } catch (error) {
        // console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Validate the token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Token invalid or expired"
            });
        }

        const email = decodedToken.email;
        const hashedPassword = bcrypt.hashSync(password, 10);

        let user;
        if (decodedToken.role == "ngo") {
            user = await Ngo.findOneAndUpdate(
                { email },
                { $set: { password: hashedPassword } },
                { new: true }
            )
        } else {
            user = await Restaurant.findOneAndUpdate(
                { email },
                { $set: { password: hashedPassword } },
                { new: true }
            )
        }

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = { ngoSignup, restaurantSignup, login, authenticateToken, logout, refreshTokenHandler, forgetPassword, resetPassword }