const express = require("express");
const dotenv = require("dotenv");
const app = express();
const userRoutes = require("./routes/userRoutes")

// middleware
dotenv.config(); //load env variables
app.use(express.json());

app.use('/user', userRoutes);
// app.use('/food-listing', listingRoutes);
// app.use('/ngo', ngoRoutes);
// app.use('/restaurant', restaurantRoutes);

const dbConnect = require("./config/database");
dbConnect();

const PORT = process.env.PORT;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});