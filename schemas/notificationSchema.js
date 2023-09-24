const mongoose=require("mongoose");




const Schema = mongoose.Schema;

const notificationSchema=new Schema({
 
    userTo:{type:Schema.Types.ObjectId,ref:"User"},
    userFrom:{type:Schema.Types.ObjectId,ref:"User"},
    chat:{type:Schema.Types.ObjectId,ref:"Chat"},
    opened:{type:Boolean,default:false},
    message:{type:Schema.Types.ObjectId,ref:"message"}
});


var Notification=mongoose.model("Notification",notificationSchema);



module.exports=Notification;

