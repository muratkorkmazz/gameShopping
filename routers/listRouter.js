
const express = require("express");

const middleware=require("../middleware");

const Product = require("../schemas/productSchema");
const Chat = require("../schemas/chatSchema");
const Notification = require("../schemas/notificationSchema");
const Payments = require("../schemas/paymentsSchema");
const router = express.Router();



router.get("/:id", async (req, res, next) => {

    let id = req.params.id;
     
    try {
        var list = await Product.findOne({_id:id,status:-1}).populate({ path: "user" });


        if(!list){
            return res.send("<h1>Ürün Bulunamadı...</h1>");
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }

    var user = req.session.user;
    var chatLink;
    var notifications=null;
    if (!user) {
        chatLink = "/login";
    } 
    else {

        try{
        if (list.user._id != user._id) {

            chatLink=`/chat/${list.user.username}`  
        }

    
         notifications= await Notification.find({userTo:user._id,opened:false}).count();
         
        
    }catch(err){
        console.log(err);
        return res.sendStatus(400);
    }

    }
    let payload = user;

    res.render("list.ejs", { payload: payload, list: list,chatLink:chatLink,notifications:notifications});
})




router.delete("/:id",middleware.requireLogin,async (req,res)=>{

    var id=req.params.id;
    var user=req.session.user;
    try{
    var result=await Product.findOneAndDelete({_id:id,user:user._id,status:-1});
    }catch(err){
        console.log(err);
        return res.sendStatus(400);
    }

    if(! result){
        return res.status(400).json({
            "result":"No permission",
        })
    }
    
return res.sendStatus(200);
 

})






router.patch("/seller/cancel/:id",async (req,res)=>{

var user=req.session.user;
var listNo=req.params.id;

// console.log(listNo);
try{

     var check=new Date()-(24*60*60*1000);
    var result=await Product.findOne({_id:listNo,user:user._id,status:0}).populate({path:"payment",match:{createdAt:{$lte:check}}});
    if(!result.payment){
        return res.status(400).json({result:"iptal etmek için 24 saat geçmesi gereklidir..."});
    }
    await Product.findOneAndUpdate({_id:listNo},{status:-1,boughtBy:null,payment:null});

}catch(err){
    console.log(err);
    return res.sendStatus(400);
}


return res.status(200).json({result:"iptal edildi"});

})


router.patch("/buyer/confirm/:id",async (req,res)=>{

 var user=req.session.user;
 var listNo=req.params.id;
 var type=req.body.type;

 var result= await Product.findOneAndUpdate({_id:listNo,boughtBy:user._id,status:0},{status:1});

    if(result){
        return res.sendStatus(200);
    }else{
        return res.sendStatus(400);
    }

})

router.patch("/buyer/cancel/:id",async(req,res)=>{""

    var user=req.session.user;
    var listNo=req.params.id;
    var type=req.body.type;

    
    var result= await Product.findOneAndUpdate({_id:listNo,boughtBy:user._id,status:0},{status:2});

            if(result){
                return res.sendStatus(200);
            }else{
                return res.sendStatus(400);
            }


})


module.exports = router;