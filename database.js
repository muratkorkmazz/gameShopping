const mongoose=require("mongoose");



class Database {
    
    constructor(){
        this.connect();
    }
    connect(){
    mongoose.connect( "mongodb+srv://muratkorkmaz:password@cluster0.a3commn.mongodb.net/?retryWrites=true&w=majority")
    .then(()=>{console.log("Db connection succesfull")})
    .catch((err)=>{console.log(err);}) 
    }
}


module.exports=new Database();
