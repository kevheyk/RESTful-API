// Require packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// Set Environment
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
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
  },
  content:{
    type: String,
    required: true
  }
});

const Article = mongoose.model("Article", articleSchema);

// Start Building API
// GET

app.route("/articles")
.get((req, res)=>{
  Article.find({},{},(err, docs)=>{
    if (err){
      res.send("Error finding all articles : " + err);
    } else{
      res.send(docs)
    }
    res.send(docs);
  })
})
.post((req, res)=>{
  const article = new Article({
    title: req.body.title,
    content: req.body.content 
  });
  article.save({validateBeforeSave:true},function(err, docs){
    if (err){
      res.send("Error Occurs when saving: "+ err);
    } else{
      res.send("New article saved")
    }
  });
})
.delete((req, res)=>{
  Article.deleteMany({title:"Test"},(err)=>{
    if (err){
      res.send("Error deleting: "+err);
    } else{
      res.send("Success Delete");
    }
  });
});


app.get("/articles/:title",(req, res)=>{
  Article.find({title:req.params.title},{},(err,doc)=>{
    if(err){
      console.log("Error finding specific article: " + err)
    } else{
      res.send(doc)
    }
  });
});

app.put("/articles/:title", (req, res)=>{
  console.log(req.body)
  Article.update(
    {title:req.params.title},
    { //$set does nothing different.
      title:req.body.title,
      content: req.body.content}, 
    {overwrite:true}, 
    //Overwrite: Defualt false
    // True: removed the original document.
    (err)=>{
      if (err){
        console.log("Error replacing:" + err);
      } else{
        res.send("Success replace article")
      }
    })
})


app.patch("/articles/:title", (req, res)=>{
  Article.update(
    {title:req.params.title},
    req.body,//$set makes no difference
    (err)=>{
      if (err){
        console.log("Error updating:" + err);
      } else{
        res.send("Success updated article")
      }
    })
})

app.delete("/articles/:title", (req, res)=>{
  Article.deleteOne(
    {title:req.params.title},
    (err)=>{
      if (err){
        console.log("Error deleting:" + err);
      } else{
        res.send("Success deleted article")
      }
    })
})

