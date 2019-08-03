//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const _ = require("lodash");
const app = express();

app.use(bodyparser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb+srv://makar:Makar@123@cluster0-svaqq.mongodb.net/todoDB",{useNewUrlParser: true});
// schema
const itemSchema = new  mongoose.Schema({
  name:String
});
var item = mongoose.model("item",itemSchema);

const reading = new item({
  name:"reading"
});
const cooking = new item({
  name:"cooking"
});
const market = new item({
  name:"market"
});

var defaultitems = [reading,cooking,market];

const listSchema ={
  name : String,
  items : [itemSchema]
};

var List = mongoose.model("List",listSchema);

app.get("/",function(req,res){

  item.find({},function(err,foundItem){
if(foundItem.length === 0){
  item.insertMany(defaultitems,function(err){
    if(err){
      console.log(err);
    }else{
      console.log("success");
    }
  });
  res.redirect("/");
}else{
  res.render("list",{listtitle : "Today",adder : foundItem});
  }
});
});





  // let today = new Date();
  //
  //
  // let option = {
  //   weekday : "long",
  //   day : "numeric",
  //   month  : "long"
  // };
  // let day = today.toLocaleDateString("en-US",option);

app.post("/",function(req,res){
  console.log(req.body);
  const listname = req.body.lists;

  let newitem = new item({
    name:req.body.additem
  });

  if(listname === "Today"){
    newitem.save();
    res.redirect("/");
  }else{
    List.findOne({name : listname},function(err,result){
      result.items.push(newitem);
      result.save();
      res.redirect("/" + listname);
    });
  }

  });

app.post("/delete",function(req,res){
  const checkedboxID = req.body.checkboxx;
  const listname = req.body.lissstName;

  if(listname === "today"){
    item.findByIdAndRemove(checkedboxID,function(err){
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/");
        console.log("successfully deleted checked item");
      }
    });

  }
  else{
     List.findOneAndUpdate({name:listname},{$pull:{items:{_id:checkedboxID}}},function(err,result){
       if(!err){
         res.redirect("/"+listname);
       }
     });
  }


});

app.get("/:customListItem",function(req,res){
  const customListItem =_.capitalize(req.params.customListItem);

  List.findOne({name:customListItem},function(err,result){
    if(!err){
      if(!result){
        console.log("not exists");
        const list = new List({
          name:customListItem,
          items : defaultitems
        });
        list.save();
        res.redirect("/" + customListItem);
      }
      else{
        res.render("list",{listtitle : result.name,adder : result.items});
      }
    }
  });

});

app.listen(4000,function(){
  console.log("server started at port 4000");
});
