const { MongoDBStore } = require("connect-mongodb-session");
const express = require("express");
const bcrypt = require("bcryptjs");
const { Store } = require("express-session");
const session = require("express-session");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const mongoDBsession = require("connect-mongodb-session")(session);
const app = express();
const Usermodel = require("./Model/user");
const port = 3000;
const mongodbURI = 'mongodb://127.0.0.1:27017/Sessions';
const address = require('address');
require("./DB/connection");
// this session middleware creates on request body
// mongodb store has 3 components uri , database name , collection name
const store = new mongoDBsession ({
    uri : mongodbURI,
    collection : "users"
}); 
const oneDay = 1000 * 60 * 60 * 24;

app.use(session({
    secret: "this is a secret key",
    resave:false,
    saveUninitialized:false,
    cookie: { maxAge: oneDay },
    store:store
}));

// middleware to authenticate just after login
const user_auth = (req , res , next)=>{
    if(req.session.user_auth){
        next()
    }
    else
    {
        res.redirect('http://localhost:3000/login');
    }
}
//setting view engine to ejs , telling our server to use EJS template engine
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parser middleware
app.use(cookieParser());

//serving public file
app.use(express.static(__dirname));

app.get('/' , (req , res)=>{  
    res.render("index");
})
app.get('/register' , (req , res) =>{
    res.render("register");     
});

app.post('/register' , async(req , res)=>{
    const {username , email , password } = req.body; // extracting the user details from request body
    // searching from our usermodel if email is exist or not. 
    let user = await Usermodel.findOne({email});
    if(user){
        return res.redirect('http://localhost:3000/register')
    }
    const hashedpwd = await bcrypt.hash(password , 12);
    user = new Usermodel({
        username,
        email,
        password : hashedpwd
    });
    await user.save();
    res.redirect('http://localhost:3000/login')
});
app.get('/login' , (req , res) =>{
    res.render("login");
});
app.post('/login' , async(req , res)=>{
    const {email , password} = req.body;
    // searching from our usermodel if the user with email registered or not
    let user = await Usermodel.findOne({email});
    if(!user){
        return res.redirect('http://localhost:3000/register');
    }
    const email_match = await bcrypt.compare(password , user.password)
    if(!email_match){
       return res.redirect('http://localhost:3000/login')
    }
    else
    {
        console.log(req.headers);
        console.log("req--->", req.sessionID);
        user.sessionid = req.sessionID;
        user.useragent = req.headers["user-agent"];
        user.host = req.headers.host;
        user.user_ip = address.ip();
        // let mac_adr = address(function (err, ad) {
        //     if(err)
        //     {
        //       return(err)
        //     }
        //     else
        //     {
        //       return(ad.mac);
          
        //     }
        //   });
        // user.user_MAC = mac_adr;
        await user.save();
        req.session.user_auth = true;
        req.session.cookie.email = user.email;
        console.log('req.session.cookie :', req.session.cookie);
        // req.session.user = user._id;
        res.redirect('http://localhost:3000/authenticate')
    }

});
app.get('/authenticate' ,user_auth, (req , res)=>{
        const username = req.session.username;
        res.render("authenticate", { name: username });
})

app.post('/logout' , (req , res) =>{
    req.session.destroy( (err)=>{
        if(err) throw err;
        res.redirect('/');
    });
});
app.listen(port , ()=>{
    console.log(`server running at http://localhost:${port}`)
});