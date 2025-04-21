const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../Airbnb/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utlis/wrapAsync.js");
const ExpressError= require("./utlis/ExpressError.js");
const Review = require("../Airbnb/models/review.js")


const MONGO_URL = "mongodb+srv://mdrafin008:jr976YawsNhrNZGk@cluster0.7gknfrz.mongodb.net/wanderlust ";


main().then(() =>{
      console.log("connected to DB");

}).catch(err =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs" );
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
 

app.get("/", (req, res)=>{
    res.send("Hi, I am root");
});

// index route
app.get("/listings", async(req, res) =>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing})
});

app.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs")
})

app.get("/listings/:id", async(req, res) =>{
    let {id} = req.params;
    const listing = await  Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//Create Route
app.post("/listings", wrapAsync(async(req, res, next)=>{
      let result = listingSchema.validate(req.body);
      console.log(result);
      const newListing =  new Listing(req.body.listing)
      await newListing.save();
      res.redirect("/listings");
}));
// edit route
app.get("/listings/:id/edit", async(req, res)=>{
    let {id} = req.params;
    const listing = await  Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render(message);
});

// update route
 app.put("/listings/:id", async(req, res) =>{
      let {id} = req.params;
      await Listing.findByIdAndUpdate(id, {...req.body.listing});
      res.redirect("/listings");
 })

//delete route

app.delete("/listings/:id", async(req, res) => {
      let {id} = req.params;
      let deleteListing = await Listing.findByIdAndDelete(id);
      res.redirect("/listings");
})

//reviews post route
app.post("/listings/:id/reviews", async(req, res) =>{
    const listing = await Listing.findById(req.params.id);
   console.log(listing)
  if (!listing) {
    return res.status(404).send("Listing not found");
  }

  const newReview = new Review(req.body.review);
  console.log(newReview);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

   res.redirect(`/listings/${listing._id}`);

})


// app.get("/testListing", async(req,res)=>{
//    let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Barisal, Bangladesh",
//     country:" Bangladesh"
//    });

   

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

  

app.listen(8080,()=>{
    console.log("server is listening to port 8080");

})
