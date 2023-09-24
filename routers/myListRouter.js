
const express=require("express");

const Notification = require("../schemas/notificationSchema");
const Product= require("../schemas/productSchema");


const router=express.Router();



router.get("/",async (req,res,next)=>{


    var payload=req.session.user;

    try{
    var notifications=await Notification.find({userTo:payload._id,opened:false}).count();
    var products=await Product.find({user:payload._id,status:-1});
    }catch(err){
        console.log(err)
        return res.sendStatus(400);
    }
    
    res.render("myList",{payload:payload,notifications:notifications,products:products});
    
})


router.get("/purchase",async (req,res)=>{

    var payload=req.session.user;

    try{
    var notifications=await Notification.find({userTo:payload._id,opened:false}).count();
    var products=await Product.find({boughtBy:payload._id,status:1});
    console.log(products);
    }catch(err){
        console.log(err)
        return res.sendStatus(400);
    }
    
    res.render("purchase",{payload:payload,notifications:notifications,products:products});


})



router.get("/selling",async (req,res)=>{

    var payload=req.session.user;

    try{
    var notifications=await Notification.find({userTo:payload._id,opened:false}).count();
    var products=await Product.find({user:payload._id,status:1});
    }catch(err){
        console.log(err)
        return res.sendStatus(400);
    }    
    res.render("sell",{payload:payload,notifications:notifications,products:products});
})



router.get("/waiting/alis",async (req,res)=>{

    var payload=req.session.user;

    try{
    var notifications=await Notification.find({userTo:payload._id,opened:false}).count();
    var products=await Product.find({boughtBy:payload._id,status:0});
    }catch(err){
        console.log(err);
        return res.sendStatus(400);
    }    
    res.render("waiting",{payload:payload,notifications:notifications,products:products});
});



router.get("/waiting/satis",async (req,res)=>{

    var payload=req.session.user;

    try{
    var notifications=await Notification.find({userTo:payload._id,opened:false}).count();
    var products=await Product.find({user:payload._id,status:0});
    }catch(err){
        console.log(err);
        return res.sendStatus(400);
    }    
    res.render("waitingsell",{payload:payload,notifications:notifications,products:products});
});









module.exports=router;