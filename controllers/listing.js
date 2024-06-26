const { render } = require("ejs");
const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    let allListing=await Listing.find();
    res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs"); 
};

module.exports.showListing=async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");   
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs",{listing});
    }  
};

module.exports.createListing=async(req,res,next)=>{
    let coordinates=req.body.listing.location;
   let response=await geocodingClient.forwardGeocode({
        query: coordinates,
        limit: 2
      })
      .send();

    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);   
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");   
}

module.exports.editListing=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }else{
        let originalImagelUrl=listing.image.url;
        originalImagelUrl=originalImagelUrl.replace("/upload","/upload/c_thumb,g_face,h_200,w_200/r_max/f_auto");
        res.render("listings/edit.ejs",{listing,originalImagelUrl}); 
    }   
}

module.exports.updateListing=async(req,res,next)=>{
    let {id}=req.params; 
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    let coordinates=req.body.listing.location;
    let response=await geocodingClient.forwardGeocode({
         query: coordinates,
         limit: 2
       })
       .send();

    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    }
    listing.geometry=response.body.features[0].geometry;
    await listing.save();
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}

module.exports.search=async(req,res)=>{
    let {search}=req.query;
    let allListing;

    if (search && search.length>0) {
        allListing = await Listing.find({ location: { $regex: new RegExp(search, 'i') } }).exec();
        if(allListing.length===0){
            req.flash("error","No listings found!");
            return res.redirect("/listings");
        }
        res.locals.success = `you searched ${search}`;
    } else {
        allListing = await Listing.find().exec();
        
    }
    res.render("listings/index.ejs", { allListing });
}