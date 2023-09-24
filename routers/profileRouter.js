
const express = require("express");
const Notification = require("../schemas/notificationSchema");
const Product = require("../schemas/productSchema");
const Chat = require("../schemas/chatSchema");
const User= require("../schemas/userSchema");

const router = express.Router();



router.get("/:username", async (req, res, next) => {

    var user = req.session.user;
    var ntf = null;
    var profileName= req.params.username;
    try {

        var profileUser=await User.findOne({username:profileName});
        if(profileUser){
        var products = await Product.find({ user:profileUser._id,status: -1 }).populate({ path: "user", select: 'username _id profilePic'});
        }else{
            return res.send("<h1>Böyle bir kullanıcı bulunamadı...</h1>")
        }
        if (user) {
            ntf = await Notification.find({ userTo: user, opened: false }).count();


            //check if the requested user and owner of profile page are same.
            if (user._id != products[0].user._id) {

                var chat = await Chat.findOne({
                    $and: [{ users: products[0].user._id }, { users: user._id }]
                });

                if (chat) {
                    var chatLink = `/chat/${chat._id}`;
                }
                else {
                    var newChat = await Chat.create({ users: [products[0].user._id, user._id] });
                    var chatLink = `/chat/${newChat._id}`;
                }

            }else{
                var chatLink="";
            }

        }else{
            var chatLink="/login";
        }






    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }


    res.render("profile.ejs", { payload: user, notifications: ntf, products: products,chatLink:chatLink});

})


module.exports = router;