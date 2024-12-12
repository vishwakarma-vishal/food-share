const CollectionHistory = require("../models/CollectionHistory");
const FoodListing = require("../models/FoodListing");

const getAllFoodListing = async (req, res) => {
    try {
        const foodListings = await FoodListing.find();

        if (!foodListings || foodListings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No food listings found.",
            });
        }

        res.status(200).json({
            success: true,
            FoodListings: foodListings
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
}

const addListingToCollection = async (req, res) => {
    const { FoodListingId } = req.body;
    const ngoId = req.ngoId;

    if (!FoodListingId) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the required information"
        });
    }

    try {
        const foodListingInDb = await FoodListing.findById(FoodListingId);

        if (!foodListingInDb) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            })
        }

        const updatedFoodListing = {
            status: 'reserved',
            reservedBy: ngoId,
            reservedAt: new Date().toLocaleString()
        }

        const updatedFoodListingInDb = await FoodListing.findByIdAndUpdate(FoodListingId, { $set: updatedFoodListing }, { new: true });

        res.status(200).json({
            success: true,
            message: "Listing is updated"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

const getCollectionHistory = async (req, res) => {
    const ngoId = req.ngoId;

    if (!ngoId) {
        return res.status(401).json({
            success: false,
            message: "Please provide the required information."
        });
    }

    try {
        const collectionHistory = await CollectionHistory.find();

        if (!collectionHistory || collectionHistory.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Collection history not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Collection history is fetched.",
            collectionHistory
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
}

module.exports = { addListingToCollection, getCollectionHistory, getAllFoodListing }