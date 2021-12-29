const { MongoDBStore } = require("connect-mongodb-session");
const express = require("express");
const { Store } = require("express-session");
const session = require("express-session");
const mongoose = require("mongoose");
const ejs = require("ejs");
const mongoDBsession = require("connect-mongodb-session")(session);
const app = express();
const Usermodel = require("./Model/user");
const port = 3000;
// require("./views/index.html")
// require("./views/register.html")
// require("./views/login.html")
// require("./views/app.css")
const mongodbURI = 'mongodb://127.0.0.1:27017/Sessions';
require("./DB/connection")
// using middleware to get router
// app.use('/' , require("./Routes/route"));
// this session middleware creates on request body
// mongodb store has 3 components uri , database name , collection name
const store = new mongoDBsession ({
    uri : mongodbURI,
    collection : "all sessions"
}); 
app.use(session({
    secret: "this is a secret key",
    resave:true,
    saveUninitialized:true,
    store:store
}));
//setting view engine to ejs , telling our server to use EJS template engine
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

app.get('/' , (req , res)=>{
    console.log(req.session);    
    console.log(req.session.id);    
    // res.sendFile('views/index.html',{root:__dirname});
    res.render("index");
})
app.get('/register' , (req , res) =>{
    res.render("register");     
});

app.post('/register' , async(req , res)=>{
    const {username , email , password } = req.body;
    let user = await Usermodel.findOne({email});
    if(user){
        return res.redirect('localhost:3000/register')
    }
    user = new Usermodel({
        username,
        email,
        password
    })

});
app.get('/login' , (req , res) =>{
    res.render("login");
});
app.post('/register' , (req , res)=>{});
app.listen(port , ()=>{
    console.log(`server running at http://localhost:${port}`)
});