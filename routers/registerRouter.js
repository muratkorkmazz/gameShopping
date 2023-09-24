const express=require("express");
const csrf = require('csurf');
const bcrypt=require("bcrypt");
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");


const User=require("../schemas/userSchema");
const Token=require("../schemas/tokenSchema");



let csrfProtection = csrf({ cookie: true });

const transporter=nodemailer.createTransport({
    host:"sandbox.smtp.mailtrap.io",
    port:2525,
    auth:{
        user:"bf056d50c54b49",
        pass:"35e982ad46ee50"
    }
})

const sendEmail=async (options,req,res)=>{

    try {
    
    //define the email options
    const mailOptions={
        from:"Murat Korkmaz <murat28546100@gmail.com",
        to:options.email,
        subject:"account verification",
        text:options.message
    }
    // send the email
    // console.log("before email sent")
   await transporter.sendMail(mailOptions)
//    console.log("after email sent")
}
catch(err){
        console.log("error occured");
        throw err;
}
}





const router=express.Router();





router.get("/verification",csrfProtection,(req,res,next)=>{
   
    try {
        var decoded = jwt.verify(req.cookies.jwt,'lasting nights');
        const user=decoded.userToken;
        if(user){
           return res.status(200).render("registerVer.ejs",{ csrfToken: req.csrfToken(),message:null});
        }
      
    } catch(err) {   
        return res.redirect("/register");
      }

})

router.post("/verification",csrfProtection,async (req,res,next)=>{
 

    let token=req.body.emailToken.trim();

    if (!token){
        return res.status(200).render("registerVer.ejs",{ csrfToken: req.csrfToken(),message:"You should provide a token"});
    }
    
    try {

    var decoded = jwt.verify(req.cookies.jwt,'lasting nights');
     var user =decoded.userToken;

    let docToVerify= await Token.findOne({userId:user})

    const result=bcrypt.compare(token, docToVerify.otp);

    if(result){
        let verifiedUser= await User.findOneAndUpdate({_id:docToVerify.userId},{verified:true},{new:true});
        res.clearCookie('jwt', { path: '/register/verification' });
        req.session.user=verifiedUser;

        return res.redirect("/");

    }else{
            return res.render("registerVer.ejs",{ csrfToken: req.csrfToken(),message:"Wrong code"})  ;
    }

    }catch(err){
        return res.render("registerVer.ejs",{ csrfToken: req.csrfToken(),message:err}); 

    }

})






router.get("/",csrfProtection,(req,res,next)=>{

    res.render("register.ejs",{ csrfToken: req.csrfToken(),payload:{}})
});




router.post("/",csrfProtection,async (req,res,next)=>{

    const email=req.body.email.trim();
    const username=req.body.username.trim();
    const password=req.body.password.trim();
    const confPassword=req.body.confPassword.trim();

    var payload=req.body;

    if(email && username && password && confPassword){

        //check password and confirmation password matchs
        const passlength=password.length;
        const namelength=username.length;
        if(passlength>20 || passlength<7){
            payload.message="password should be in range of 7 and 20";
            return res.render("register.ejs",{payload:payload,csrfToken: req.csrfToken()});
        }
        if(namelength>25 ||namelength<7){
            payload.message="username should be in range of 7 and 25";
            return res.render("register.ejs",{payload:payload,csrfToken: req.csrfToken()});

        }

        if(password != confPassword){
             payload.message="password doesen't match";
            return res.render("register.ejs",{payload:payload,csrfToken: req.csrfToken()});
        }

        // Check if username or email are already in use
       var user=await User.findOne({ 
            $and:[
                {verified:true},{ $or:[ {username:username },{email:email}]}
            ]       
        }).catch(err=>{
            payload.message="something went wrong please try again..."
            return res.render("register.ejs",{payload:payload,csrfToken: req.csrfToken()});
        })

        if(user){
            payload.message="username or email are already in use Please try another..."
            return res.render("register.ejs",{payload:payload,csrfToken: req.csrfToken()});
        }
    
        //create unverified user as well as hashing password

       
        
        try{

            let hashedPassword= await bcrypt.hash(password,10);

       let newUser= await User.create({
            email:email,
            username:username,
            password:hashedPassword
        })

        //create a token for verifying account and sending email process
        const tokenOtp=`${Math.floor(1000+Math.random()*9000)}`;
        const tokenEmail=newUser.email;   
        const tokenMessage=`${tokenOtp}`;
        const hashedOtp=await bcrypt.hash(tokenOtp,8);

        let token=await Token.create({
           userId:newUser._id,
            otp:hashedOtp,
            createdAt:new Date(),
            expiresAt:new Date()+180000
        })


        
        sendEmail({ 
            email:tokenEmail,
            message:tokenMessage
            });

            //setting jwt cookie. It's not secure for now. I will change as soon as I start using https

            var jwtToken = jwt.sign({userToken:token.userId}, 'lasting nights',{expiresIn:"300000ms"});
            res.cookie("jwt",jwtToken,{
                secure:false,
                httpOnly:true,
                path:"/register/verification",
                maxAge:300000,
                sameSite:true
            })

            return res.redirect("/register/verification");


    }catch(err){

        payload.message=err;
        return res.render("register.ejs",{payload:payload,csrfToken: req.csrfToken()});
    }

    }

    // ---if inputs are empty---------
    else {

        return res.send("empty input");
    }

})







module.exports=router;



