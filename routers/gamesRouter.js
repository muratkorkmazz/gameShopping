
const express=require("express");

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


let sort={
    "1":["gamePrice","desc"],
    "2":["gamePrice","asc"],
    "3":["createdAt","desc"],
    "4":["createdAt","asc"]
}



router.get("/:game",async (req,res,next)=>{

  
    var name=req.params.game;
    var queries={};
    gameList=list[name];
    if(!gameList){
        return res.sendStatus(400);
    }
    
    try{
    let query= Product.find({gameName:name,status:-1});

    if(req.query.server){
       query=query.find({gameServer:req.query.server});
    }
    if(req.query.category){
        query=query.find({gameCategory:req.query.category});

    }
    if(req.query.order){
        let todo=sort[req.query.order];
        if(todo){
            query=query.sort({[todo[0]]:todo[1]});
        }
    }
    var products=await query;
}catch(err){
    return res.sendStatus(400);
}

    let payload=req.session.user;
    var notifications=null;  
    if(payload){
        try{
        notifications= await Notification.find({userTo:payload._id,opened:false}).count();
      
        }catch(err){
            console.log(err);
            return res.sendStatus(400);
        }
    }

 
 
    res.render("game.ejs",{payload:payload,products:products,gameList:gameList,notifications:notifications,queries:req.query});
})


module.exports=router;