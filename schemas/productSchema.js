const mongoose=require("mongoose");


var status={
   "-1":"onSale",
    "0":"on pending",
    "1":"sold"
}



const Schema = mongoose.Schema;

const ProductSchema=new Schema({

    gameName:{
        type:String,
        required:true,
        trim:true,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },

    status:{
      type:Number,
      default:-1
    },
    gameServer:{
        type:String,
        required:true,
        trim:true,
    },
    gameCategory:{
        type:String,
     },
     gameHeader:{
        type:String,
        required:true,
        trim:true
     },
     gameExpl:{
        type:String,
        required:true,
        trim:true
     },
     gamePrice:{
        type:Number,
        required:true,
     },
     img1:{
        type:String,
        default:""
     },
     img2:{
        type:String,
        default:""
     },
     boughtBy:{
      type:Schema.Types.ObjectId,
      ref:"User",
      default:null
     },
     iban:{
      type:String,
      required:true,
      trim:true
     },
     payment:{
      type:Schema.Types.ObjectId,
      ref:"Payments"
     },
     completed:{
      type:Boolean,
      default:false
     }
},{timestamps:true});


var Product=mongoose.model("ProductSchema",ProductSchema);



module.exports=Product;




