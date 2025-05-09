module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.flash("success", "You must be Logged in to create Listing");
       return  res.redirect("/login");
   }else{
    req.flash("Failed", "You must be Logged in to create Listing");
   }
       
   next();
};

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.saveRedirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}