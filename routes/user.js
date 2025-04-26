const express = require("express");
const router = express.Router();
const  User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) =>{
    res.render("users/signup.ejs");
})


router.post("/signup", async(req, res)=>{
    let {username, email, password} = req.body;
    const newUser= new User({email, username});
     const registerUser = await User.register(newUser, password);
     console.log(registerUser);
     req.login(registerUser, (err)=>{
        if(err){
            return next(err);

        }
        req.flash("success", "Welcome to wanderlust");
        res.redirect("/listings");
     })
    
})

router.get("/login", (req, res) =>{
    res.render("users/login.ejs");
})
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login", 
    failureFlash: true
}), (req, res) => {
   
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(   redirectUrl);
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
