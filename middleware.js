module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.flash("success", "You must be Logged in to create Listing");
       return  res.redirect("/login");
   }

   next();
}