
const express=require("express");

const fs=require("fs/promises");
const User= require("../schemas/userSchema");
const Notification= require("../schemas/notificationSchema");

const multer  = require('multer')
const upload = multer({ dest: "public/pp"});


const router=express.Router();



router.get("/",async (req,res,next)=>{

        
    var user=req.session.user;

    try{

    
    var account= await User.findById(user);
    var notifications=await Notification.find({userTo:user._id,opened:false}).count();        
}catch(err){
    console.log(err);
    return res.sendStatus(400);
}



    res.render("myAccount.ejs",{payload:user,notifications:notifications,account:account});

    
})


router.post("/",upload.single('profilePic'),async(req,res)=>{


    var user=req.session.user;


    if(!req.file){
        return res.sendStatus(200);
    }

    try{

    
    await fs.rename(req.file.path,`${req.file.path}.png`);
    await User.updateOne({_id:user._id},{profilePic:`/pp/${req.file.filename}.png`});

    }catch(err){
        console.log(err);
        return res.sendStatus(400);
    }

    res.sendStatus(200);

})

module.exports=router;