//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { default: mongoose } = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5 = require("md5")

const app = express()
console.log(process.env.SECRET)


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




const User = mongoose.model("User", userSchema)


app.get("/", function(req, res){
    res.render("home");
  });

  
app.get("/login", function(req, res){
    res.render("login");
  });
  
app.get("/register", function(req, res){
    res.render("register");
  });

app.post("/register", async function(req, res){
    const newUser = new User({
        email : req.body.username,
        password: md5(req.body.password),
    })
    await newUser.save()
    res.render("secrets")
    console.log("Successfully save username")
  })

app.post("/login", async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const check = await User.findOne({email: username})
    if (check.password === md5(password)) {
        res.render("secrets")
        console.log(check)
    }
    else {
        console.log(check)
        console.log("Error")
        res.redirect("/login")
        console.log(md5(check.password))
    }
}) 

app.listen(port, () => {
    console.log("Server connected successfully")
})
