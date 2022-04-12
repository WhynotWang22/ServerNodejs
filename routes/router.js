const express = require('express');
const router = express.Router();
var User = require('../model/users');
var multer = require('multer');


/* GET users listing. */

var storage = multer.diskStorage({
  destination:function (req,file,cb){
    cb(null,"./uploads");
  },

  filename: function (req,file,cb){
    cb(null, file.fieldname + "_" + Date.now()+ "_" +file.originalname);

  },
});

var upload = multer({
  storage:storage,
}).single("image");

//Insert an user into database router


router.post("/add",upload,(req,res)=>{
  const user = new User({
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,
    image:req.file.filename,
  });

  user.save((err)=>{
    if (err){
      res.json({message:err.message,type:'dange'});
    }else {
      req.session.message = {
        type:'success',
        message:'User added successfully!'
      };
      res.redirect("/");
    }
  })
});

router.get('/',function (req, res) {
 User.find().exec((err,users)=>{
   if (err){
     res.json({message:err.message});
   }else {
     res.render("index",{
       title:"Web ảnh Anime Đẹp",
       users:users,
     });
   }
 });
});


router.get("/add",(req,res)=>{
  res.render("add_users",{title:"Add Users"});
});

//Edit an uers route
router.get("/edit/:id",(req,res)=> {
  let id = req.params.id;
  User.findById(id,(err,user)=>{
    if (err){
      res.redirect("/");
    }else {
      if (user ==null){
        res.redirect("/");
      }else{
        res.render("edit_users",{
          title:"Edit User",
          user:user,
        });
      }
    }
  });
});

//Update uẻ route

router.post("/Update/:id",upload,(req,res) =>{
  let id = req.params.id;
  let new_image = "";

  if (req.file){
    new_image = req.file.filename;
    try{
      fs.unlinkSync("./uploads" +req.body.old_image);
    }catch(err){
      console.log(err);
    }
  }else{
    new_image = req.body.old_image;
  }

  User.findByIdAndUpdate(
    id,
      {
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image: new_image,
      },
      (err,result) =>{
       if (err){
         res.json({message:err.message,type: "dange"});
       }else {
         req.session.message = {
           type: "success",
           message:"User updated successfully!"
         };
         res.redirect("/");
       }
      })
});

//Delete users route

router.get("/delete/:id",(req,res)=>{
  let id = req.params.id;
  User.findByIdAndRemove(id,(err,result) =>{
    if (result.image != ''){
      try{
        fs.unlinkSync('./uploads/'+result.image);
      }catch (err){
        console.log(err);
      }
    }
    if (err){
      res.json({message:err.message});
    }else {
      req.session.message = {
        type: 'info',
        message: 'User deleted successfully!'
      };
      res.redirect("/");
    }
  })
});
module.exports = router;
