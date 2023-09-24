const { Timestamp } = require("mongodb");
const mongoose=require("mongoose");
const { boolean } = require("simple-is");



// I'm gonna get the payment doc where payment completed false and list status 1.
//  I'm gonna change the completed field to true when I paid the transaction.




const Schema = mongoose.Schema;

const paymentsSchema=new Schema({

  
    userToPurchase:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    seller:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    ibanTo:{
        type:String,
        required:true,
        trim:true
    },
    list:{
        type:Schema.Types.ObjectId,
        ref:"Product"
    },
    completed:{
        type:boolean,
        default:false
    }


},{ timestamps: true });


var Payments=mongoose.model("Payments",paymentsSchema);



module.exports=Payments;

