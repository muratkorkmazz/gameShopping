
const express=require("express");
const multer  = require('multer')
const upload = multer({ dest: "public/uploads"});
const fs=require("fs/promises");
const Product=require("../schemas/productSchema");
const Notification=require("../schemas/notificationSchema");
const router=express.Router();



let list = {
    "metin2": {
        "servers": ["alnilam", "amber", "berilia", "columbia", "dolunay", "felis", "germania", "italy", "kehribar", "lynx", "portekiz", "pts", "şems", "tubul", "van", "all", "türkiye", "teutonia", "marmara", "anadolu", "arkadaşlar", "ayaz", "azrael", "bagjanamu", "bahar", "barbaros", "dandanakan", "ege", "ezel"],
        "categories": ["karakter", "yang-won", "silah", "zırh-kalkan-ayakkabı-kask", "küpe-bilezik-kolye", "nesne-market-ürünler", "simya", "diğer"]
    },
    "valorant": {
        "servers": ["valorant-tr", "valorant-euw"],
        "categories":["Hesap","Point"]
    },
    "League-Of-Legends":{
        "servers":["League-Of-Legends TR","League-Of-Legends-EUW","League-Of-Legends-West"],
        "categories":["Hesap","Point"]
    },
}




router.get("/",async(req,res,next)=>{


    var payload=req.session.user;
   var notifications=await Notification.find({userTo:payload._id,opened:false}).count()

  res.render("addProduct.ejs",{payload:payload,notifications:notifications});
    
})





router.post("/",upload.array('images', 2),async (req,res,next)=>{


var obj={};


for(let i=0;i<req.files.length;i++){
    obj[`img${i+1}`]=`${req.files[i].filename}.png`;
    var target=`${req.files[i].path}.png`;
    try {
    await fs.rename(req.files[i].path,target);
    }catch(err){
        return res.sendStatus(404);
    }
}

obj[`gameName`]=req.body.gameName;
obj[`gameServer`]=req.body.gameServer;
obj[`gameCategory`]=req.body.gameCategory;
obj[`gameHeader`]=req.body.gameHeader;
obj[`gamePrice`]=req.body.gamePrice;
obj[`gameExpl`]=req.body.gameExpl;
obj["user"]=req.session.user;
obj["iban"]=req.body.iban;

//I will make a few validation here ....
try{
var newProduct=await Product.create(obj);
}catch(err){
    console.log(err);
    return res.sendStatus(400);
}

return res.sendStatus(200);

    })
    


module.exports=router;