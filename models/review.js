const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Review schema
const reviewSchema = new Schema({
    text: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Check if the 'Review' model is already defined
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

module.exports = Review;

