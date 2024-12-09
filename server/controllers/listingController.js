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
            message: "New listing is created",
            foodListingInDb
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            err
        });
    }
}

module.exports = { createFoodListing };