const { default: mongoose } = require("mongoose");


const Schema = mongoose.Schema;

const chatSchema=new Schema({


    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"message"
    },
},{timestamps:true});


var Chat=mongoose.model("Chat",chatSchema);



module.exports=Chat;




