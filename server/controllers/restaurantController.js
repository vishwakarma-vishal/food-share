const DonationHistory = require("../models/DonationHistory");
const FoodListing = require("../models/FoodListing");
const CollectionHistory = require("../models/CollectionHistory");
const Restaurant = require("../models/Restaurant");
const Ngo = require("../models/Ngo");
const { z } = require("zod");
const cloudinaryUpload = require("../utils/cloudinaryUpload");

// get use info
const getUserProfile = async (req, res) => {
    const restaurantId = req.restaurantId;

    try {
        const userInDb = await Restaurant.findOne({_id:restaurantId});

        if (!userInDb) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const userObject = userInDb.toObject();
        const { createdAt, __v, password, ...safeUser } = userObject;

        res.status(200).json({
            success: true,
            message: "User information fetched successfully.",
            user: safeUser
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

// Mark food as collected, add at in donation history of restaurant and collection history of ngo
const addListingToHistory = async (req, res) => {
    const { foodListingId } = req.body;
    const restaurantId = req.restaurantId;

    if (!foodListingId) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the required information"
        });
    }

    try {
        const foodListingInDb = await FoodListing.findById(foodListingId);

        if (!foodListingInDb) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }

        if (foodListingInDb.restaurantId.toString() !== restaurantId) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed"
            });
        }

        if (foodListingInDb.status == 'available') {
            return res.status(403).json({
                success: false,
                message: "This listing is not reserved yet."
            })
        }

        if (foodListingInDb.status == 'collected') {
            return res.status(403).json({
                success: false,
                message: "This listing has already been collected.",
            });
        }

        // tranaction session starts from here
        // step-1 mark food as collected
        const updatedFoodListing = await FoodListing.findByIdAndUpdate(
            foodListingId,
            { $set: { status: "collected" } },
            { new: true }
        );

        if (!updatedFoodListing) {
            return res.status(404).json({
                success: false,
                message: "Failed to update",
            });
        }

        // step-2 add to donation history of restro
        await DonationHistory.create({
            restaurantId,
            foodListingId,
            status: "collected",
        });

        // step-3 add to collection history of ngo
        await CollectionHistory.create({
            ngoId: foodListingInDb.reservedBy,
            foodListingId,
        });
        // end transaction session (completed)

        res.status(200).json({
            success: true,
            message: "Listing is collected"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

// Get donation history
const getDonationHistory = async (req, res) => {
    const restaurantId = req.restaurantId;

    if (!restaurantId) {
        return res.status(401).json({
            success: false,
            message: "Please provide all the required information."
        });
    }

    try {
        const donationHistory = await DonationHistory.find({ restaurantId: restaurantId })
            .populate({
                path: "foodListingId",
                select: "title reservedBy",
                populate: {
                    path: "reservedBy",
                    select: "name"
                }
            });

        if (donationHistory.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No food donation made by the restrorant yet.",
                donationHistory: []
            });
        }

        res.status(200).json({
            success: true,
            message: "Donation history is fetched.",
            donationHistory
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
}

// Update restaurant profile
const updateRestaurantProfile = async (req, res) => {
    try {
        const restaurantId = req.restaurantId;
        const file = req.files?.restaurantImg;

        if (!req.body.data) {
            return res.status(400).json({
                success: false,
                message: "Missing data in request body",
            });
        }
        const data = JSON.parse(req.body.data);

        const updateRestaurantProfileSchema = z.object({
            name: z.string()
                .trim()
                .min(3, "Restaurant Name must be at least 3 characters")
                .max(100, "Restaurant Name cannot exceed 100 characters")
                .optional(),
            about: z.string()
                .trim()
                .max(100, "About cannot exceed 100 characters")
                .optional(),
            openFrom: z.string()
                .trim()
                // .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format")
                .optional(),
            openTill: z.string()
                .trim()
                // .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format")
                .optional(),
            city: z.string()
                .trim()
                .min(3, "City must be at least 3 characters")
                .max(20, "City cannot exceed 20 characters")
                .optional(),
            address: z.string()
                .trim()
                .min(3, "Address must be at least 3 characters")
                .max(200, "Address cannot exceed 200 characters")
                .optional(),
        });
        const sanitizedData = updateRestaurantProfileSchema.parse(data);

        const userInDb = await Restaurant.findById(restaurantId);
        if (!userInDb) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        // img upload
        let secure_url = userInDb.profileImg;
        let public_id = userInDb.imgPublicId;

        if (file) {
            const result = await cloudinaryUpload(file, "food-share/user/restaurant", public_id);
            secure_url = result.secure_url;
            public_id = result.public_id;
        }

        // Update data
        const updatedFields = {
            ...sanitizedData,
            profileImg: secure_url,
            imgPublicId: public_id
        };

        const updatedUserInDb = await Restaurant.findByIdAndUpdate(
            restaurantId,
            { $set: updatedFields },
            { new: true }
        );

        // creating safe user obj to send in response
        const userObject = updatedUserInDb.toObject();
        const { _id, role, password, __v, createdAt, ...safeUser } = userObject;

        res.status(200).json({
            success: true,
            message: "User updated",
            safeUser
        })

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
            message: "Something went wrong"
        })
    }
}

module.exports = { addListingToHistory, getDonationHistory, updateRestaurantProfile, getUserProfile }