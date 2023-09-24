
const express=require("express");
const Chat=require("../schemas/chatSchema");
const Message=require("../schemas/messageSchema");
const Notification=require("../schemas/notificationSchema");
const User = require("../schemas/userSchema");


const router=express.Router();

router.get("/",async (req,res,next)=>{

    var user=req.session.user;
    try{
        //get chats according to user requesting this page
        var chats= await Chat.find({users:user._id},{"users":{$elemMatch:{$ne:user._id}}}).sort({updatedAt:"desc"}).populate({path:"users"}).populate({path:"latestMessage"});
        var notifications=await Notification.find({userTo:user._id,opened:false}).count(); 
        console.log(chats);
    }catch(err){
        console.log(err);
        return res.sendStatus(400);
    }

    console.log(notifications);
    res.render("chat.ejs",{payload:req.session.user,chats:chats,notifications:notifications});
    
})

router.get("/:username" ,async(req,res,next)=>{

    var usernameToChat=req.params.username;
    var user=req.session.user;


try{

    var userToChat=await User.findOne({username:usernameToChat});


 
    if(userToChat){

        var userToChatId=String(userToChat._id)


        if(userToChatId==user._id){

            return res.send("<h1>Geçersiz kullanıcı...</h1>");

        }
        
        var chat=await Chat.findOne({$and:[{users:user._id},{users:userToChatId}]},{"users":{$elemMatch:{$ne:user._id}}}).populate({path:"users"});

        // var chat=await Chat.findOne({users:["64cf28cf93567409ec5757ed","64da1b4f2b28bc119d3bcd6e"]},{"users":{$elemMatch:{$ne:user._id}}}).populate({path:"users"});


        var messages=[];

        if(!chat){
            chat = await Chat.create({ users: [userToChat._id, user._id]});
            chat=await Chat.findById(chat._id,{"users":{$elemMatch:{$ne:user._id}}}).populate({path:"users"});

        }else{

            messages=await Message.find({chat:chat._id});
            await Notification.updateMany({chat:chat._id,userTo:user._id},{opened:true});
        }

        var notifications=await Notification.find({userTo:user._id,opened:false}).count(); 

        
        return res.render("customChat.ejs",{payload:user,chat:chat,messages:messages,notifications:notifications});
        
    }else{
        return res.sendStatus(400);
    }
    
}catch(err){
    console.log(err);
    return res.sendStatus(400);
}

        // try{
        //     var userToChat=await User.findOne({username:usernameToChat});
        // // var chat=await Chat.findOne({$and:[{_id:chatNo},{users:user._id}]},{"users":{$elemMatch:{$ne:user._id}}}).populate({path:"users"});
    
        // var chat=await Chat.findOne({$and:[{users:userToChat},{users:user._id}]},{"users":{$elemMatch:{$ne:user._id}}}).populate({path:"users"});

        
        // }
        // catch(err){
        //     console.log(err);
        //     return res.sendStatus(400);
        // }

        // if(!chat){
        //     return res.sendStatus(400);
        // }
        // try{
        //     var messages=await Message.find({chat:chat._id});

        //     await Notification.updateMany({chat:chat._id,userTo:user._id},{opened:true});
            
        //     var notifications=await Notification.find({userTo:user._id,opened:false}).count(); 
          
        // }catch(err){
        //     console.log(err);
        // }

        // return res.render("customChat.ejs",{payload:user,chat:chat,messages:messages,notifications:notifications});


})




// message post api

router.post("/:chatNo",async(req,res,next)=>{

    var user=req.session.user;
    var message=req.body.content;
    var chatNo=req.params.chatNo;

    if(!user || !message || !chatNo){

        return res.sendStatus(400);
    }

    try{
    // var chat=await Chat.findOne({$and:[{_id:chatNo},{users:user._id}]});

    var chat=await Chat.findOne({$and:[{_id:chatNo},{users:user._id}]},{"users":{$elemMatch:{$ne:user._id}}});

    console.log(chat);

    if(chat){
       var newMessage= await Message.create({sender:user._id,content:message,chat:chat._id});
       console.log(newMessage);
        var ntf=await Notification.create({userTo:chat.users[0]._id,userFrom:user._id,chat:chat._id,message:newMessage._id});
        await Chat.findByIdAndUpdate(chat._id,{latestMessage:newMessage._id});
    }
    else{
        return res.sendStatus(400);
    }   
}catch(err){
    console.log(err);
    return res.sendStatus(400);
}
    return res.status(200).json({
        status:"success",
        message:newMessage
    });
}) 




//api for getting the unreaded notification count for specified chat 

router.get("/notification/:chatNo/:id",async(req,res,next)=>{



    var chat=req.params.chatNo;
    var user=req.params.id;

    

    try{

        var count=await Notification.find({chat:chat,userTo:user,opened:false}).count();
        
    }catch(err){
        console.log(err)
        return res.sendStatus(400);
    }

    

      return res.status(200).json({
        status:"success",
        count:count
      })
})





//API for deleting the notification if user is already in the chat room 
router.patch("/notification/:id",async (req,res,next)=>{

    var id=req.params.id;

    try{
    var ntf=await Notification.updateOne({message:id},{opened:true});
    }catch(err){
        return res.sendStatus(400);
    }

    return res.sendStatus(200);

})

module.exports=router;