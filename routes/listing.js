const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing} = require("../middleware");
const controllerListing=require("../controllers/listing");
const multer  = require('multer')
const {storage}=require("../cloudConfig");
const upload = multer({ storage });

//search route
router.get("/search",wrapAsync(controllerListing.search));

//index route 
router.route("/")
.get(wrapAsync(controllerListing.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(controllerListing.createListing))
 
// new route
router.get("/new",isLoggedIn,controllerListing.renderNewForm);

//show route
router.route("/:id")
.get(wrapAsync(controllerListing.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(controllerListing.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(controllerListing.destroyListing)); 

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(controllerListing.editListing));

module.exports=router;
