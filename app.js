const express = require('express')
let ejs = require("ejs");
let path = require("path");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const database = require("./database");
var session = require('express-session')
const { v4: uuidv4 } = require('uuid');



//  Models
var Chat = require("./schemas/chatSchema");
var User= require("./schemas/userSchema");
var Notification = require("./schemas/notificationSchema");
var Product= require("./schemas/productSchema");
var Payments= require("./schemas/paymentsSchema");
var Message= require("./schemas/messageSchema");
var Token= require("./schemas/tokenSchema");

// custom middleware functions
var middleware = require("./middleware");


// ----controllers-------
let loginRouter = require("./routers/loginRouter");
let registerRouter = require("./routers/registerRouter");
let logoutRouter = require("./routers/logoutRouter");
let addProductRouter = require("./routers/addProductRouter");
let gamesRouter = require("./routers/gamesRouter");
let listRouter = require("./routers/listRouter");
let chatRouter = require("./routers/chatRouter");
let myListRouter= require("./routers/myListRouter");
let profileRouter= require("./routers/profileRouter");
let myAccountRouter= require("./routers/myAccountRouter");
let paymentRouter= require("./routers/paymentRouter");

const app = express();

//we will create the middleware to add some headers for iframe and content security police

// content security police l 7 - m40,m51
// block the iframe, 







const server = app.listen(3000, () => {
  console.log("Server listening on port 3000 ...")
})

const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket) => {

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");

  })

  socket.on("join room", async (data) => {
    var chat = await Chat.findOne({ _id: data.no, users: data.user });
    if (chat) {
      socket.join(data.no);
    }

  });

  socket.on("typing", (chatNo) => {
    socket.to(chatNo).emit("typing");
  })

  socket.on("stop typing", (chatNo) => {
    socket.to(chatNo).emit("stop typing");
  })

  socket.on("new message", (data) => {

    socket.to(data.userToSend).emit("new message", { content: data.content, chatNo: data.chatNo, _id: data._id });

  })

})


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'unfortunately',
  resave: true,
  saveUninitialized: false,
  cookie: { secure: false,httpOnly:true,
  sameSite:"lax"},
  
}))






//Default page
app.get("/", async (req, res, next) => {
 

  var payload = req.session.user;
  var notifications = null;
  try{
  if (payload) {
    notifications = await Notification.find({ userTo: payload._id, opened: false }).count();
  }


  var lists=await Product.find({gameName:"metin2",status:-1}).limit(10);


}catch(err){
  console.log(err);
  return res.sendStatus(400);
}
  res.render("index.ejs", { payload: payload, notifications: notifications,lists:lists});
})


app.use("/payment",paymentRouter);
app.use("/myAccount",middleware.requireLogin,myAccountRouter);
app.use("/profile",profileRouter);
app.use("/myList",middleware.requireLogin,myListRouter);
app.use("/chat", middleware.requireLogin, chatRouter);
app.use("/list", listRouter);
app.use("/games/", gamesRouter);
app.use("/ilan-ver", middleware.requireLogin, addProductRouter);
app.use("/login", middleware.notRequireLogin, loginRouter);
app.use("/register", middleware.notRequireLogin, registerRouter);
app.use("/logout", logoutRouter);









app.use((err, req, res, next) => {
  res.status(500).send(`${err}`);
})

