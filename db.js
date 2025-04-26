require('dotenv').config(); // Import the dotenv package

const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL; // Use environment variable

const main = async () => {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to DB");
    } catch (err) {
        console.log("Error connecting to DB:", err);
    }
};

main();

module.exports = MONGO_URL;