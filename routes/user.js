const express = require("express");
const router = express.Router();
const  User = require("../models/user.js");
const passport = require("passport");

router.get("/signup", (req, res) =>{
    res.render("users/signup.ejs");
})


router.post("/signup", async(req, res)=>{
    let {username, email, password} = req.body;
    const newUser= new User({email, username});
     const registerUser = await User.register(newUser, password);
     console.log(registerUser);
     req.flash("success", "User was registered");
     res.redirect("/listings");
})

router.get("/login", (req, res) =>{
    res.render("users/login.ejs");
})
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login", 
    failureFlash: true
}), (req, res) => {
    console.log("hurray");
    req.flash("success", "Welcome back!");
    res.redirect("/listings")
});

router.get("/logout", (req, res, next)=>{
    req.logout((err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    });
})


module.exports = router;
