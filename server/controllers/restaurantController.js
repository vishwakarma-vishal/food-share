const DonationHistory = require("../models/DonationHistory");
const FoodListing = require("../models/FoodListing");
const CollectionHistory = require("../models/CollectionHistory");

// to mark food as collected, add at in donation history of restaurant and collection history of ngo
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

const getDonationHistory = async (req, res) => {
    const restaurantId = req.restaurantId;

    if (!restaurantId) {
        return res.status(401).json({
            success: false,
            message: "Please provide all the required information."
        });
    }

    try {
        const donationHistory = await DonationHistory.find();

        if (!donationHistory || donationHistory.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Listings are not found"
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

module.exports = { addListingToHistory, getDonationHistory }