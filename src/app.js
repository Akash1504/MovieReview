require('dotenv').config();
const express=require("express");
const multer=require('multer');
const bcrypt=require('bcrypt');
const path=require("path");
const app=express();
const mongoose = require('mongoose');
var cookieParser=require("cookie-parser");
const bodyParser=require("body-parser");
require("./db/conn");
const hbs=require("hbs");
const Register=require("./models/registers");
const Movie=require("./models/movie-model");
const Comment=require("./models/Comment");
const { text } = require("body-parser");
const { Mongoose } = require("mongoose");
 const fs=require('fs-extra');
const { callbackify } = require("util");
const port=process.env.PORT || 3000;

const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../template/views");
const partials_path=path.join(__dirname,"../template/partials");
const auth=require("./middleware/auth");
//we have the index.html path here
app.use(express.static(static_path));

app.use(cookieParser());
//we have the index.hbs path here
app.set("view engine","hbs");

//telling to exxpress thepath of views
app.set("views",template_path);
hbs.registerPartials(partials_path);
// app.use(busboy());

app.use(express.urlencoded({extended:true}));
app.use(express.json());



//  const storage=multer.diskStorage({
//      destination:(req,file,cb)=>{
//          cb(null,'uploads')
//      },
//      filename:(req,file,cb)=>{
//          cb(null,file.filename + '-' + Date.now())
//      }
//  });
// const storage=multer.diskStorage({
//     destination:'public/uploads/',
//     filename:(req,file,cb)=>{
//         cb(null,file.filename + '-' + Date.now())
//     }
// });

//  var upload=multer({storage:storage});



app.get("/",(req,res)=>{
    res.render("index");
});


app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/addmovie",(req,res)=>{
    res.render("addmovie");
})
app.get("/addcomment",(req,res)=>{
    res.render("addcomment");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/contact",(req,res)=>{
    res.render("contact");
})

app.get("/secret",auth,(req,res)=>{
    console.log(req.cookies.jwt);
    res.render("secret");
})


//User Registration
app.post("/register",async(req,res)=>{
    try {
        const password=req.body.password;
        const confirmpassword=req.body.confirmpassword;
        if(password===confirmpassword)
        {
                const registerEmployee=new Register({
                    firstname:req.body.firstname,
                    lastname:req.body.lastname,
                    password:password,
                    confirmpassword:confirmpassword,
                    gender:req.body.gender,
                    email:req.body.email,
                    phone:req.body.phone,
                    role:req.body.role
                    
                 })
                
                const token=await registerEmployee.generateAuthToken();
                res.cookie("jwt",token,{expires:new Date(Date.now() + 50000),httpOnly:true});
                const registered=await registerEmployee.save();
                 res.status(201).render("index");
        }
        else{
            res.send("Not match");
        }

    } catch (error) {
        res.status(400).send(error);
    }
})



//User Update
app.get('/update/:id', (req, res) => {
    Register.findById({_id: req.params.id}).exec(function (err, user) {
      if (err) 
      {
        console.log("Error:", err);
      }
      else 
      {
            res.render("updateuser", {viewTitle: "Update User Details",user: user});
      }
    });
})
app.post('/update', (req, res) => {
    Register.findByIdAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
    if (!err)
     {
          res.redirect('list');
    }
    else 
    {
          
            res.render("updateuser", {viewTitle: 'Update User Details',user: req.body});
           
    }
    });
    });

//delete
app.get('/delete/:id', async(req, res) => {
        
    Register.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err)
        {
            res.redirect('/list');
        }
        else 
        { 
            console.log('Failed to Delete user Details: ' + err);
         }
        });


});
app.post("/login",async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        const role='admin'; 

        const usermail=await Register.findOne({email:email});

        const isMatch=await bcrypt.compare(password,usermail.password);
        const token=await usermail.generateAuthToken();
        res.cookie("jwt",token,{expires:new Date(Date.now() + 600000),httpOnly:true});
            

        if(isMatch && usermail.role == role)
        {
            
            res.status(201).render("admin");
        }
        else if(usermail.password == password)
        {
            res.status(201).render("movuser");
        }
      
        else
        {
            res.render("login", {viewTitle: 'Invalid Password....'});
        }
    } catch (error) {
        res.render("login", {viewTitle: 'Invalid Email....'});
    }
})
//logout
app.get('/logout',auth,async(req,res)=>{
    try {
        req.user.tokens=req.user.tokens.filter((token)=>{
            
        return token.token !== req.token
        })
        res.clearCookie("jwt");
        await req.user.save();
        res.render("login");
    } catch (error) {
        res.status(400).send(error);
    }
})



// app.get('/list',async(req,res)=>{
//     await Register.find((err,doc)=>{
//         if(!err){
//             res.render("list",{
//                 list:doc
//             });
//         }
//         else{
//             re.send("Failed");
//         }
//     })
// })
app.get('/list',auth, (req,res) => {
    Register.find((err, docs) => {
    if(!err){
    res.render("list", {
    list: docs
    });
    }
    else {
    console.log('Failed to retrieve the Course List: '+ err);
    }
    });
    });
// ***************************Movie*******************
app.post('/addmovie',async(req,res )=>{
    try {
           const addNewMovie=new Movie({
                    name:req.body.name
                    
                 }
                 
                 )
                 const added=await addNewMovie.save();
                 res.status(201).render("admin");
      

    } catch (error) {
        res.status(400).send(error);
    }
})



app.get('/movielist', (req,res) => {
    Movie.find((err, docs) => {
        if(err){
                console.log(err);
                }
         else{
            res.render("movielist", {movielist: docs });
             }
    });

    });


    app.get('/user', (req,res) => {
        Movie.find((err, docs) => {
        if(!err)
        {
        res.render("user", {movielist: docs });
        }
        else
         {
        console.log('Failed to retrieve the Course List: '+ err);
        }
        });
        });
//update mov
app.get('/updatemov/:id', (req, res) => {
    Movie.findById({_id: req.params.id}).exec(function (err, user) {
      if (err) 
      {
        console.log("Error:", err);
      }
      else 
      {
       
            res.render("updatemov", {viewTitle: "Update Movie Details",movies: user});
      }
    });
})
app.post('/updatemov', (req, res) => {
    Movie.findByIdAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
    if (!err)
     {
       
          res.redirect('movielist');
    }
    else 
    {
          
            res.render("updatemov", {viewTitle: 'Update Movie Details',movies: req.body});
           
    }
    });
    });

//delete
app.get('/deletemov/:id', async(req, res) => {
        
    Movie.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err)
        {
            res.redirect('/movielist');
        }
        else 
        { 
            console.log('Failed to Delete user Details: ' + err);
         }
        });


});
    

   

app.get('/getmovie/:id',(req,res)=>{

   Movie.findOne({_id:req.params.id})
        .populate({path:'comments',select:'text rating _id'})
        .then((result)=>{
             res.render("cpmmlist", {result: result});
            
        }).catch((error)=>{res.status(400).send(error) })
         
    });
    
  
    
    app.post('/addcomment',(req,res)=>{
    const comment=new Comment();
    comment.name=req.body.name;
    comment.text=req.body.text;
    comment.rating=req.body.rating;
    comment.save().then((result)=>{
        Movie.findOne({name:comment.name},(err,movie)=>{
                if(movie)
                {
                    movie.comments.push(comment);
                    movie.save();
                    res.status(201).render("movuser");
                   
                }
                else{
                    res.status(401).render("commerroe");
                }
        })
    })
})

 app.get('/updatecom/:id', (req, res) => {
           Comment.findById({_id: req.params.id}).exec(function (err, user) {
              if (err) 
              {
                console.log("Error:", err);
              }
              else 
              {
               
                    res.render("updatecom", {viewTitle: "Update Review Details",movies: user});
              }
            });
        })
        app.post('/updatec', async(req, res) => {
            const aa=await Comment.findByIdAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
            if (!err)
             {
               
                  res.redirect('movielist');
            }
            else 
            {
                  
                    res.render("updatecom", {viewTitle: 'Update Review Details',movies: req.body});
                   
            }
            });
            });
       
      //delete comments 
        app.get('/deletecom/:id', async(req, res) => {
            try {

                Comment.findByIdAndRemove(req.params.id, (err, doc) => {
                    if (!err)
                    {
                        res.redirect('cpmmlist');
                    }
                    else 
                    { 
                        console.log('Failed to Delete user Details: ' + err);
                     }
                    });
            } 
            
            
            catch (error) {
                
            }
       });

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});