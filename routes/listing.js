const express = require("express");
const router = express.Router();
const wrapAsync = require("../utlis/wrapAsync.js");
const ExpressError = require("../utlis/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js"); // Assuming you have a Review model
const Joi = require("joi");

// Validation Schema (Define it if not already defined)
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required()
    }).required()
});

// Index route
router.get("/", wrapAsync(async(req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}));

// New listing form route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show listing route
router.get("/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
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
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));

// Edit route
router.get("/:id/edit", wrapAsync(async(req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// Update route
router.put("/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
}));

// Delete route
router.delete("/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// Reviews post route
router.post("/:id/reviews", wrapAsync(async(req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }

    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

module.exports = router;
