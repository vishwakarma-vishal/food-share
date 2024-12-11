const FoodListing = require("../models/FoodListing");

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
            status : 'reserved',
            reservedBy: ngoId,
            reservedAt : new Date().toLocaleString()
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

module.exports = {addListingToCollection}