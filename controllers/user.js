const User=require("../models/user");

module.exports.renderSignupForm=async(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res,next)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({username,email});
    const registerUser=await User.register(newUser,password);
    req.logIn(registerUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wonderlust");
        res.redirect("/listings");
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    const redirectUrl=res.locals.redirectUrl || "/listings";
    req.flash("success","Welcome back to Wonderlust");
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}