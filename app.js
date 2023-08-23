//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { default: mongoose } = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5")
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
// const bcrypt = require("bcrypt")
// const saltRounds = 10;

const app = express()
// console.log(process.env.SECRET)

app.use(session({
    secret: "Out little secret",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());





const port = 3000
const url = "mongodb://127.0.0.1:27017/userDB?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.3"


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(url)

userSchema = new mongoose.Schema ({
    email: String,
    password: String,
})

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] } );
userSchema.plugin(passportLocalMongoose);



const User = mongoose.model("User", userSchema)
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    res.render("home");
  });

  
app.get("/login", function(req, res){
    res.render("login");
  });
  
app.get("/register", function(req, res){
    res.render("register");
  });

app.get("/secrets", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("secrets")
    }
    else {
        res.redirect("/login")
    }
})


app.post("/register", async function(req, res){
    User.register({username: req.body.username}, req.body.password , function(err,user){
        if (err) {
            console.log(err);
            res.redirect("/register")
        }
        else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets")
            })
        }
    })
    // bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
    //     const newUser = new User({
    //         email : req.body.username,
    //         password: hash
    //     })
    //     await newUser.save()
    //     res.render("secrets")
    //     console.log("Successfully save username")
    // });
})

app.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


app.post("/login", async (req, res) => {
    const user = new User( {
        username: req.body.username,
        password: req.body.password,
    })

    req.login(user, function(err) {
        if (err) {
            console.log(err)
        }
        else {
            passport.authenticate("local") (req ,res , function (){
                res.redirect("secrets");
            })
        }
    })



    // LEVEL 4 SECTION 
    // const username = req.body.username
    // const password = req.body.password
    // const check = await User.findOne({email: username})
    // bcrypt.compare(password, check.password, function(err, result) {
    //     if (result === true) {
    //         console.log(check)
    //         res.render("secrets")
    //     }      
    //     else {
    //         console.log("Error")
    //         res.redirect("/login")
    //     }
    // });
}) 

app.listen(port, () => {
    console.log("Server connected successfully")
})
