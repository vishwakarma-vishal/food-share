const express = require("express");
const dotenv = require("dotenv");
const app = express();

// middleware
dotenv.config(); //load env variables

app.use('/user', userRoutes);
app.use('/food-listing', listingRoutes);
app.use('/ngo', ngoRoutes);
app.use('/restaurant', restaurantRoutes);

const PORT = process.env.PORT;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});