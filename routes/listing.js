const express = require("express");
const router = express.Router();
const wrapAsync = require("../utlis/wrapAsync.js");
const ExpressError = require("../utlis/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js"); // Assuming you have a Review model
const Joi = require("joi");
const { isLoggedIn } = require("../middleware.js");

// Validation Schema (Define it if not already defined)
const listingSchema = Joi.object({
    listing: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required().min(0),
      location: Joi.string().required(),
      country: Joi.string().required(),
      image: Joi.object({
        url: Joi.string().uri().required()
      }).optional()
    }).required()
});

// Index route
router.get("/", wrapAsync(async(req, res) => {
    console.log("Route hit for all listings");
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}));

// New listing form route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// Show listing route with reviews populated
router.get("/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate("owner")
        .populate("reviews");  
    
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }

    res.render("listings/show.ejs", { listing });
}));

// Create new listing
router.post("/", wrapAsync(async(req, res, next) => {
    const result = listingSchema.validate(req.body);
    console.log(result);

    // Handle validation errors here
    if (result.error) {
        throw new ExpressError(result.error.details[0].message, 400);
    }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

// Edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }

    res.render("listings/edit.ejs", { listing });
}));

// Update route
router.put("/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
}));

// Delete route
router.delete("/:id", isLoggedIn, wrapAsync(async(req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));

// Reviews post route
router.post("/:id/reviews", wrapAsync(async(req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }

    // Validation for review input
    if (!req.body.review || !req.body.review.text) {
        return res.status(400).send("Review text is required");
    }

    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

module.exports = router;
