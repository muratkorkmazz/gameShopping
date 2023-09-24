
module.exports.requireLogin=(req,res,next)=>{

    if(req.session && req.session.user){

        return next();
    }else{
        console.log("okokokok")
        return res.redirect("/login");
    }
}


module.exports.notRequireLogin=(req,res,next)=>{

    if(req.session && req.session.user){

        return res.redirect("/");
    }else{

        return next();
    }
}
