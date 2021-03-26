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
const ejs=require("ejs");
const Register=require("./models/registers");
const Movie=require("./models/movie-model");
const Comment=require("./models/Comment");
const Upcoming=require("./models/upcomingmovie");

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
app.set("view engine", "ejs");

//telling to exxpress thepath of views
app.set("views",template_path);
hbs.registerPartials(partials_path);
// app.use(busboy());

app.use(express.urlencoded({extended:true}));
app.use(express.json());




const storage=multer.diskStorage({
    destination:'src/uploads/',
    filename:(req,file,cb)=>{
        cb(null,file.filename + '-' + Date.now())
    }
});


 
var upload = multer({ storage: storage });

//get image-upcoming movie
app.get('/upcominglist', (req, res) => {
    Upcoming.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('upcominglist.ejs', { items: items });
        }
    });
});
app.get('/upcomingmovielistuser', (req, res) => {
    Upcoming.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('upcomingmovielistuser.ejs', { items: items });
        }
    });
});

//add upcoming movies
app.post('/addupcoming',upload.single('image'),async(req,res )=>{
    try {
           const addNewMovie=new Upcoming({
                    name:req.body.name,
                    date:req.body.date,
                    img: {
                        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                        contentType: 'image/jpg'
                    }
                    
                 }
                 
                 )
                 const added=await addNewMovie.save();
                 res.status(201).render("upcoming");
      

    } catch (error) {
        res.status(400).send(error);
    }
})
// app.post('/addupcoming', upload.single('image'), (req, res, next) => {
 
//     var obj = {
//         name: req.body.name,
//         date: req.body.date,
//         img: {
//             data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//             contentType: 'image/jpg'
//         }
//     }
//     Upcoming.create(obj, (err, item) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
           
//             res.redirect('upcoming');
//         }
//     });
// });
//update upcoming movie list
app.get('/updateupmov/:id',(req, res) => {

  Upcoming.findById({_id:req.params.id}).exec(function (err, user) {
 
      if (err) 
      {
        console.log(err);
      }
      else 
      {
        console.log(user);
            res.render("updateupmov.ejs", {movies: user});
      }
    });
})
app.post('/updateupmovlist',(req, res) => {
   
    Upcoming.findByIdAndUpdate({_id:req.body._id}, req.body, { new: true }, (err, doc) => {

        if (!err)
     { 
          
             res.redirect('upcominglist');
    }
    else 
    {
        console.log(err);
            res.render("updateupmov.ejs", {viewTitle: 'Update User Details',movies: req.body});
           
    }
    });
    });

    app.get('/deleteup/:id', async(req, res) => {
        try {
           Upcoming.findByIdAndRemove(req.params.id, (err, doc) => {
                if (!err)
                {
                    res.redirect('upcominglist.ejs');
                }
                else 
                { 
                    console.log('Failed to Delete user Details: ' + err);
                 }
                }  );
        } 
        
        catch (error) {
            console.log(error);
        }
        
        });
    


app.get("/",(req,res)=>{
    res.render("index.hbs");
});
app.get("/register",(req,res)=>{
    res.render("register.hbs");
})

app.get("/addmovie",(req,res)=>{
    res.render("addmovie.hbs");
})
app.get("/addcomment",(req,res)=>{
    res.render("addcomment.hbs");
})
app.get("/login",(req,res)=>{
    res.render("login.hbs");
})
app.get("/contact",(req,res)=>{
    res.render("contact.hbs");
})

app.get("/upcoming",(req,res)=>{
  
    res.render("upcoming.ejs");
})


//User Registration
// app.post("/register",async(req,res)=>{
//     try {
//         const password=req.body.password;
//         const confirmpassword=req.body.confirmpassword;
//         if(password===confirmpassword)
//         {
//                 const registerEmployee=new Register({
//                     firstname:req.body.firstname,
//                     lastname:req.body.lastname,
//                     password:password,
//                     confirmpassword:confirmpassword,
//                     gender:req.body.gender,
//                     email:req.body.email,
//                     phone:req.body.phone,
//                     role:req.body.role
                    
//                  })
                
//                 const token=await registerEmployee.generateAuthToken();
//                 res.cookie("jwt",token,{expires:new Date(Date.now() + 50000),httpOnly:true});
//                 const registered=await registerEmployee.save();
//                  res.status(201).render("index");
//         }
//         else{
//             res.send("Not match");
//         }

//     } catch (error) {
//         res.status(400).send(error);
//     }
// })


//work
app.post("/register",async(req,res)=>{
    try{
    let errors=[];
    if(req.body.password!==req.body.confirmpassword)
    {
        errors.push({text:'Not Match'});
    }
    if(errors.length>0)
    {
        res.render("register",{
            errors:errors,
            title:'Error',
            firstname:req.body.firstname,
                                 lastname:req.body.lastname,
                                 password:req.body.password,
                                 confirmpassword:req.body.confirmpassword,
                                 gender:req.body.gender,
                                 email:req.body.email,
                                 phone:req.body.phone,
                                 role:req.body.role
        });
    }
    else
    {
        Register.findOne({email:req.body.email}).exec( async function(error,user) {
            if(user)
            {         console.log(user);
                        let errors=[];
                        errors.push({text:'Email duplicae'});
                        res.render("register.hbs",{title:'signup',errors:errors})
            }
            else
            {
                const registerEmployee=new Register({
                    firstname:req.body.firstname,
                    lastname:req.body.lastname,
                    password:req.body.password,
                    confirmpassword:req.body.confirmpassword,
                    gender:req.body.gender,
                    email:req.body.email,
                    phone:req.body.phone,
                    role:req.body.role
                    
                 })
                
                const token=await registerEmployee.generateAuthToken();
                res.cookie("jwt",token,{expires:new Date(Date.now() + 50000),httpOnly:true});
                const registered=await registerEmployee.save();
                 res.status(201).render("index.hbs",{msg:req.body.firstname+'Registered successfullyyy..'});
            }
        })
    }}
    catch(error) {

    }
});


//User Update
app.get('/update/:id', (req, res) => {
    Register.findById({_id: req.params.id}).exec(function (err, user) {
      if (err) 
      {
        console.log("Error:", err);
      }
      else 
      {
            res.render("updateuser.hbs", {viewTitle: "Update User Details",user: user});
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
          
            res.render("updateuser.hbs", {viewTitle: 'Update User Details',user: req.body});
           
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
        const role='vendor'; 

        const usermail=await Register.findOne({email:email});

        const isMatch=await bcrypt.compare(password,usermail.password);
        console.log(isMatch);
        const token=await usermail.generateAuthToken();
        res.cookie("jwt",token,{expires:new Date(Date.now() + 600000),httpOnly:true});
            

        if(isMatch && usermail.role == role)
        {
            res.status(201).render("movuser.hbs");
           
        }
        else if(isMatch)
        {
           
            res.status(201).render("admin.hbs");
        }
      
        else
        {
            res.render("login.hbs", {viewTitle: 'Invalid Password....'});
        }
    } catch (error) {
        res.render("login.hbs", {viewTitle: 'Invalid Email....'});
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
        res.render("login.hbs");
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
    res.render("list.hbs", {list: docs});
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
                 res.status(201).render("admin.hbs");
      

    } catch (error) {
        res.status(400).send(error);
    }
})



app.get('/movielist',auth, (req,res) => {
    Movie.find((err, docs) => {
        if(err){
                console.log(err);
                }
         else{
            res.render("movielist.hbs", {movielist: docs });
             }
    });

    });


    app.get('/user',auth,(req,res) => {
        Movie.find((err, docs) => {
        if(!err)
        {
        res.render("user.hbs", {movielist: docs });
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
       
            res.render("updatemov.hbs", {viewTitle: "Update Movie Details",movies: user});
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
          
            res.render("updatemov.hbs", {viewTitle: 'Update Movie Details',movies: req.body});
           
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
 //to get the all table of cpmmlist page   
app.get('/getmovie/:id',(req,res)=>{
   
     Movie.findOne({_id:req.params.id})
            .populate({path:'comments',select:'text rating _id'})
            .then((result)=>{res.render("cpmmlist.hbs", {result: result});}).catch((error)=>{res.status(400).send(error) })
            
    });
   
   
 app.get('/avgcomnt/:id',(req,res)=>{
    var id = req.params.id;

    Comment.aggregate(
        [
            {
                $group:
                {
                    _id:id,
                    rating:
                    {
                        $avg:"$rating"
                       
                    }
                    
                }
            } 
            
        ],function(err, result) {
           
             res.render("avgcomt.hbs", {result: result});
           
            
        }
        )
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
                    res.status(201).render("movuser.hbs");
                   
                }
                else{
                    res.status(401).render("commerroe.hbs");
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
               
                    res.render("updatecom.hbs", {viewTitle: "Update Review Details",movies: user});
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
                  
                    res.render("updatecom.hbs", {viewTitle: 'Update Review Details',movies: req.body});
                   
            }
            });
            });
       
      //delete comments 
        app.get('/deletecom/:id', (req, res) => {
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