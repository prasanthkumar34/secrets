//jshint esversion:6
require('dotenv').config();// require and config dotenv for having our environmental variables.
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");//here the encryption is used for users passwords

const app=express();



app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({ //our schema should be in complete mongoose schema for mongoose-encryption
  email:String,
  password:String
});
//we are using a "convinient method" of defining a secret which is simply  a long string and we are going to use that secret to encrypt our database(source=>mongoose-encryption)
 //const secret="Thisisourlittlesecret."; //defining a secret this is defined in .env file

//now we use that secret to encrypt our database.
//Here we are gonna add mongoose encrypt as a plugin to our schema and we are gonna pass over our secret as a java script object
//process.env.SECRET; //accessing the objects from .env file is done by using process method(output=Thisisoursecret)
userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"] });//here we want to encrypt only password field not email field .So we want to add encryptfiled

const User= new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser= new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });

});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
User.findOne({email:username},function(err,foundUser){
  if(err){
    console.log(err);
  }else{
    if(foundUser){
      if(foundUser.password===password){
        res.render("secrets");
      }
    }
  }
});
});


app.listen(3000,function(){
  console.log("server started on port 3000");;
});
