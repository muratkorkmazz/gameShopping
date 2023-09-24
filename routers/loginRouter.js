const express=require("express");
const csrf = require('csurf');
const User=require("../schemas/userSchema");
const bcrypt=require("bcrypt");

let csrfProtection = csrf({ cookie: true });


const router=express.Router();



router.get("/",csrfProtection,async (req,res,next)=>{
    var payload={};
   return res.render("login.ejs",{ csrfToken: req.csrfToken(),payload:payload});
});

router.post("/",csrfProtection,async (req,res,next)=>{

    const email=req.body.email.trim();
    const password=req.body.password.trim();

    var payload={};
    
    if(email && password){
        payload=req.body;

        try{

           const user=await User.findOne({email:email,verified:true}).select("+password");
           
           if(user){

           const result=bcrypt.compare(password,user.password);
            
           if(result){
            user.password=undefined;
            req.session.user=user;
            
           return res.redirect("/");
           }else{
            payload.message="incorrect password or email";
            return res.render("login.ejs",{ csrfToken: req.csrfToken(),payload:payload});


           }



           }else{
            payload.message="there are not such a user"
        return res.render("login.ejs",{ csrfToken: req.csrfToken(),payload:payload})
           }

        
        }catch(err){
            payload.message=err;
            return res.render("login.ejs",{ csrfToken: req.csrfToken(),payload:payload})
        }

    }else{
        payload.message="provide email and password"
        return res.render("login.ejs",{ csrfToken: req.csrfToken(),payload:payload})

    }

})






module.exports=router;



