const mongoose=require("mongoose");





const Schema = mongoose.Schema;

const UserSchema=new Schema({

    username:{
        type:String,
        required:true,
        trim:true,
        minlength: 7,
         maxlength: 20
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        select:false,
        minlength: 8,
     },
     profilePic:{
        type:String,
        default:"/pp/profilePic.png"
     },
     verified:{
        type:Boolean,
        default:false
     },
},{timestamps:true});


var User=mongoose.model("User",UserSchema);



module.exports=User;




