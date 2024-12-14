const FoodListing = require("../models/FoodListing");
const { z } = require("zod");

createFoodListing = async (req, res) => {
    try {
        // input validation and santization
        const foodListingSchema = z.object({
            title: z.string()
                .trim()
                .min(3, "Title must be at least 3 characters")
                .max(200, "Title cannot exceed 200 characters"),
            category: z.enum(['veg', 'non-veg'], "Category must be either 'veg' or 'non-veg'"),
            description: z.string()
                .trim()
                .min(3, "Description must be at least 3 characters")
                .max(300, "Description cannot exceed 300 characters"),
            deliveryNote: z.string()
                .trim()
                .min(3, "Delivery Note must be at least 3 characters")
                .max(300, "Delivery Note cannot exceed 300 characters")
                .optional(),
            expiry: z.string()
                .trim()
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry Date must be in YYYY-MM-DD format"), // Corrected regex for YYYY-MM-DD
        });
        const sanitizedData = foodListingSchema.parse(req.body);

        const { title, category, description, deliveryNote, expiry } = sanitizedData;
        const restaurantId = req.restaurantId;

        const newFoodListing = new FoodListing({
            restaurantId: restaurantId,
            title: title,
            category: category,
            description: description || null,
            deliveryNote: deliveryNote || null,
            expiry: expiry,
        });

        const foodListingInDb = await newFoodListing.save();

        res.status(201).json({
            success: true,
            message: "New listing is created.",
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
        const foodListings = await FoodListing.find({ restaurantId: restaurantId });

        if (!foodListings || foodListings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Food listings found."
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
        const sanitizedData = foodListingSchema.parse(req.body);

        const { title, category, description, deliveryNote, expiry } = sanitizedData;
        const restaurantId = req.restaurantId;
        const ListingId = req.params.id;

        if (!ListingId) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required Information."
            });
        }

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

        const updatedFoodListing = {
            title: title !== undefined ? title : foodListingInDb.title,
            category: category !== undefined ? category : foodListingInDb.category,
            description: description !== undefined ? description : foodListingInDb.description,
            deliveryNote: deliveryNote !== undefined ? deliveryNote : foodListingInDb.deliveryNote,
            expiry: expiry !== undefined ? expiry : foodListingInDb.expiry,
        };

        const updatedFoodListingInDb = await FoodListing.findByIdAndUpdate(
            ListingId,
            { $set: updatedFoodListing }, // Use $set for partial updates
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Food listing is updated."
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

        const deletedListing = await FoodListing.findByIdAndDelete(ListingId);

        res.status(200).json({
            success: true,
            message: "Listing is deleted.",
            deletedListingId: deletedListing._id,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
}

module.exports = { createFoodListing, getAllFoodListingOfRestaurant, updateFoodListingById, deleteFoodListingById };  