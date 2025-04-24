const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../Airbnb/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utlis/wrapAsync.js");
const ExpressError = require("./utlis/ExpressError.js");
const Review = require("../Airbnb/models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const users = require("./routes/user.js");

const MONGO_URL = "mongodb+srv://mdrafin008:jr976YawsNhrNZGk@cluster0.7gknfrz.mongodb.net/wanderlust";

main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions= {
    secret:"mysupesecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },

};

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    next();
})

app.use("/listings", listings);
app.use("/", users);


// Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { error: err });
});

// Start the server
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
