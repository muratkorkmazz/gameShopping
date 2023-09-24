const mongoose=require("mongoose");




const Schema = mongoose.Schema;

const tokenSchema=new Schema({

   userId:String,
   otp:String,
   createdAt:Date,
   expiresAt:Date, 
});


var TokenModel=mongoose.model("TokenModel",tokenSchema);



module.exports=TokenModel;

