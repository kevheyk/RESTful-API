// Require packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// Set Environment
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public/"));
app.listen(3000, function(){
  console.log("Server started on port 3000");
});

// Connect to Databse
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
  if (err){
    console.log(err);
  } else{
    console.log("Cononected to MongoDB/wikiDB")
  }
})

// Initiate Collection

const articleSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  }
});

const Ariticle = mongoose.model("Article", articleSchema);