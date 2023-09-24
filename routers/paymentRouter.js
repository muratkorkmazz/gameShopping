
const Product = require("../schemas/productSchema");
const Payments = require("../schemas/paymentsSchema");

const { v4: uuidv4 } = require('uuid');

var Iyzipay = require('iyzipay');


var iyzipay = new Iyzipay({
  apiKey:'sandbox-Yo7si5FBzjZ1PvcraSAisfmtHRikbHfC',
  secretKey:'sandbox-jaE7PoEDyRGJvlLV72cTV3lEBh6mjBt4',
  uri: 'https://sandbox-api.iyzipay.com'
});



const express=require("express");


const router=express.Router();



router.post("/",async (req,res,next)=>{

    

    var user=req.session.user;
    if(!user){
      return res.status(400).json({result:"Lütfen önce giriş yapınız..."})
    }
    var cardNumber=req.body.cardNumber;
    var cardHolder=req.body.cardHolder;
    var cardMonth=req.body.cardMonth;
    var cardYear=req.body.cardYear;
    var cardCvv=req.body.cardCvv;
    var list=req.body.list;
    
    
    if(!cardNumber || !cardHolder || !cardMonth || !cardYear || !cardCvv || !list){
      return res.status(400).json({result:"Eksik veya hatalı bilgi..."});
    }
    
    
    try{
    
      var listToPurchase=await Product.findOne({_id:list,status:-1});
    
      if(!listToPurchase){
    
        return res.status(400).json({result:"Ürün bulunamadı"});
      }
    
      //check whether owner of list and person to buy are not same.
        if(listToPurchase.user==user._id){
          return res.status(400).json({result:"You can't buy your list"}); 
        }
    
        //get the price of list
        var listPrice=String(listToPurchase.gamePrice);
    
    
    }catch(err){
      console.log(err);
      return res.sendStatus(400);
    }
    
    
    
    const id=uuidv4();
    
    
    
      const  data = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: id,
        price: listPrice,
        paidPrice: listPrice,
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: {
            cardHolderName: cardHolder,
            cardNumber: cardNumber,
            expireMonth: cardMonth,
            expireYear: `20${cardYear}`,
            cvc: cardCvv,
            registerCard: '0'
        },
        buyer: {
            id: user._id,
            username:user.username,
            name: 'John',
            surname: 'Doe',
            gsmNumber: '+905350000000',
            email: user.email,
            identityNumber: '74300864791',
            registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            ip: '85.34.78.112',
            city: 'Istanbul',
            country: 'Turkey',
        },
        shippingAddress: {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            zipCode: '34742'
        },
        billingAddress: {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            zipCode: '34742'
        },
        basketItems: [
            {
                id: String(listToPurchase._id),
                name: listToPurchase.gameName,
                category1: listToPurchase.gameCategory,
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price:listPrice
            },
    
           
        ]
    }; 
    
    
    iyzipay.payment.create(data, async function (err, result) {
    
      if(err){
        return res.status(400).json({result:"Something went wrong..."});
      }
    
    if(result.status !== "success"){
      console.log(result)
    return res.status(400).json({result:result.errorMessage});
    }
    
    try{
     var payment=await Payments.create({userToPurchase:user._id,seller:listToPurchase.user,ibanTo:listToPurchase.iban,list:listToPurchase._id});
     await Product.findByIdAndUpdate(listToPurchase._id,{status:0,boughtBy:user._id,payment:payment._id});
    
    
    //  send notification email to seller to send the game credentials to client
    
    //it's unclear the way to send account info...
    
    
    }catch(err){
      console.log(err);
      return res.sendStatus(400);
    }
    
            
      res.status(200).json({result:"ok"});
        
    });

    
})


module.exports=router;

