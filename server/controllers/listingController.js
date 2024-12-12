const FoodListing = require("../models/FoodListing");

createFoodListing = async (req, res) => {
    const { imageUrl, title, category, pickupTime, description, deliveryNote, expiry } = req.body;
    const restaurantId = req.restaurantId;

    if (!imageUrl || !title || !category || !expiry) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the required information."
        });
    }

    const newFoodListing = new FoodListing({
        restaurantId: restaurantId,
        imageUrl: imageUrl,
        title: title,
        category: category,
        pickupTime: pickupTime || null,
        description: description || null,
        deliveryNote: deliveryNote || null,
        expiry: expiry,
    });

    try {
        const foodListingInDb = await newFoodListing.save();

        res.status(201).json({
            success: true,
            message: "New listing is created.",
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            err
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
    const { imageUrl, title, category, pickupTime, description, deliveryNote, expiry } = req.body;
    const restaurantId = req.restaurantId;
    const ListingId = req.params.id;

    if (!ListingId) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the required Information."
        });
    }

    try {
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
            imageUrl: imageUrl !== undefined ? imageUrl : foodListingInDb.imageUrl,
            title: title !== undefined ? title : foodListingInDb.title,
            category: category !== undefined ? category : foodListingInDb.category,
            pickupTime: pickupTime !== undefined ? pickupTime : foodListingInDb.pickupTime,
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
            message: "Food listing is updated.",
            updatedFoodListingInDb
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: err.message
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
            message: "Something went wrong.",
            err
        });
    }
}

module.exports = { createFoodListing, getAllFoodListingOfRestaurant, updateFoodListingById, deleteFoodListingById };  