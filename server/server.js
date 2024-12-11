const express = require("express");
const dotenv = require("dotenv");
const app = express();
const authRoutes = require("./routes/authRoutes")
const listingRoutes = require("./routes/listingsRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");

// middleware
dotenv.config(); //load env variables
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/listing', listingRoutes);
app.use('/ngo', ngoRoutes);
app.use('/restaurant', restaurantRoutes);

const dbConnect = require("./config/database");
dbConnect();

const PORT = process.env.PORT;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});