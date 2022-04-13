//improts
require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
var fs = require('fs')
const session = require("express-session");
const Console = require("console");

const app = express();
const PORT = process.env.PORT || 8080;

// //database connect
mongoose.connect(process.env.DB_URI,{});
const db = mongoose.connection;
db.on('error',(error)=> console.log(error));
db.once('open',()=> console.log('Connected to  the database!'));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(
    session({
        secret:"my secret key",
        saveUninitialized:true,
        resave:false,
    })
);

app.use((req,res,next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static("uploads"));

//set template engine
app.set("view engine","ejs");


//router prefix
app.use("",require("./routes/router"))

app.listen(PORT,()=>{
    console.log(`Server started at http://locahost:${PORT}`);
});