const { MongoDBStore } = require("connect-mongodb-session");
const express = require("express");
const { Store } = require("express-session");
const session = require("express-session");
const mongoose = require("mongoose");
const mongoDBsession = require("connect-mongodb-session")(session);
const app = express();
const port = 3000;
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

app.get('/' , (req , res)=>{
    console.log(req.session);    
    console.log(req.session.id);    
    res.send("creating user auth");
})
app.post('/register' , (req , res) =>{
    
});

app.post('/login' , (req , res) =>{

});
app.listen(port , ()=>{
    console.log(`server running at http://localhost:${port}`)
});