const Restaurant = require("../models/Restaurant");
const FoodListing = require("../models/FoodListing");
const { z } = require("zod");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const cloudinary = require("cloudinary");

createFoodListing = async (req, res) => {
    try {
        const restaurantId = req.restaurantId;
        const file = req.files?.listingImg;

        if (!req.body.data) {
            return res.status(400).json({
                success: false,
                message: "Missing data in request body",
            });
        }
        const data = JSON.parse(req.body.data);

        // input validation and santization
        const foodListingSchema = z.object({
            title: z.string()
                .trim()
                .min(3, "Title must be at least 3 characters")
                .max(100, "Title cannot exceed 100 characters"),
            category: z.enum(['veg', 'non-veg'], "Category must be either 'veg' or 'non-veg'"),
            expiry: z.string()
                .trim()
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry Date must be in YYYY-MM-DD format"), // Corrected regex for YYYY-MM-DD
            pickupFrom: z.string()
                .trim()
                .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
            pickupTill: z.string()
                .trim()
                .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
            description: z.string()
                .trim()
                .min(3, "Description must be at least 3 characters")
                .max(300, "Description cannot exceed 300 characters"),
            deliveryNote: z.string()
                .trim()
                // .min(3, "Delivery Note must be at least 3 characters")
                .max(100, "Delivery Note cannot exceed 100 characters")
                .optional(),
        });
        const sanitizedData = foodListingSchema.parse(data);

        const userInDb = await Restaurant.findById(restaurantId);
        if (!userInDb) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        // img upload
        let secure_url;
        let public_id;

        if (file) {
            const result = await cloudinaryUpload(file, "food-share/listing");
            secure_url = result.secure_url;
            public_id = result.public_id;
        }

        const newFoodListing = new FoodListing({
            ...sanitizedData,
            restaurantId: restaurantId,
            imageUrl: secure_url,
            imgPublicId: public_id
        });

        const foodListingInDb = await newFoodListing.save();

        res.status(201).json({
            success: true,
            message: "New listing is created.",
            foodListingInDb
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
            message: "Something went wrong.",
        });
    }
}

getAllFoodListingOfRestaurant = async (req, res) => {
    const restaurantId = req.restaurantId;

    try {
        const foodListings = await FoodListing.find({ restaurantId: restaurantId })
        .populate({
            path: "reservedBy",
            select: "name"
        });

        if (foodListings.length === 0) {
            return res.status(200).json({
                success: true,
                message: "You haven't posted any listing yet.",
                foodListings: []
            })
        }

        res.status(200).json({
            success: true,
            foodListings
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
}

updateFoodListingById = async (req, res) => {
    try {
        const restaurantId = req.restaurantId;
        const ListingId = req.params.id;
        const file = req.files?.listingImg;

        if (!req.body.data) {
            return res.status(400).json({
                success: false,
                message: "Missing data in requrest body."
            });
        }
        const data = JSON.parse(req.body.data);

        // Validate and sanitize data
        const foodListingSchema = z.object({
            title: z.string()
                .trim()
                .min(3, "Title must be at least 3 characters")
                .max(200, "Title cannot exceed 200 characters")
                .optional(),
            category: z.enum(['veg', 'non-veg'], "Category must be either 'veg' or 'non-veg'").optional(),
            description: z.string()
                .trim()
                .min(3, "Description must be at least 3 characters")
                .max(300, "Description cannot exceed 300 characters")
                .optional(),
            deliveryNote: z.string()
                .trim()
                .min(3, "Delivery Note must be at least 3 characters")
                .max(300, "Delivery Note cannot exceed 300 characters")
                .optional(),
            expiry: z.string()
                .trim()
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry Date must be in YYYY-MM-DD format")  // Corrected regex for YYYY-MM-DD
                .optional(),
        });
        const sanitizedData = foodListingSchema.parse(data);

        if (!ListingId) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required Information."
            });
        }

        // Check if user exists
        const userInDb = await Restaurant.findById(restaurantId);
        if (!userInDb) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        // Check if the listing exists
        const foodListingInDb = await FoodListing.findById(ListingId);
        if (!foodListingInDb) {
            return res.status(404).json({
                success: false,
                message: "Food Listing not found."
            });
        }

        if (foodListingInDb.restaurantId.toString() !== restaurantId) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to update this listing",
            });
        }

        // image upload
        let secure_url = foodListingInDb.imageUrl;
        let public_id = foodListingInDb.imgPublicId;

        if (file) {
            const result = await cloudinaryUpload(file, "food-share/listing", public_id);
            secure_url = result.secure_url;
            public_id = result.public_id;
        }

        const updatedFoodListing = {
            ...sanitizedData,
            imageUrl: secure_url,
            imgPublicId: public_id,
        };

        const updatedFoodListingInDb = await FoodListing.findByIdAndUpdate(
            ListingId,
            { $set: updatedFoodListing }, // Use $set for partial updates
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Food listing is updated.",
            updatedFoodListingInDb
        })

    } catch (error) {
        console.log(error);

        if (error instanceof z.ZodError) {
            console.log(error.errors.map((err) => err.message));
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

deleteFoodListingById = async (req, res) => {
    const restaurantId = req.restaurantId;
    const ListingId = req.params.id;

    if (!ListingId) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the required information."
        });
    }

    try {
        const foodListingInDb = await FoodListing.findById(ListingId);

        if (!foodListingInDb) {
            return res.status(404).json({
                success: false,
                message: "Food listing not found.",
            });
        }

        if (foodListingInDb.restaurantId.toString() !== restaurantId) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to delete the listing."
            });
        }

        // delete from db and cloudinary
        const deletedListing = await FoodListing.findByIdAndDelete(ListingId);
        if (deletedListing.imgPublicId) {
            const deleteImg = await cloudinary.uploader.destroy(deletedListing.imgPublicId);
        }

        res.status(200).json({
            success: true,
            message: "Listing is deleted.",
            deletedListingId: deletedListing._id
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
}

module.exports = { createFoodListing, getAllFoodListingOfRestaurant, updateFoodListingById, deleteFoodListingById };  