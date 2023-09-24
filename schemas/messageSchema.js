const  mongoose = require("mongoose");


const Schema = mongoose.Schema;

const messageSchema=new Schema({

    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        trim:true,
        required:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:true
    },

},{timestamps:true});


var Message=mongoose.model("message",messageSchema);



module.exports=Message;




