const express=require("express");
const app=express();
const jwt=require('jsonwebtoken');
const Register=require("../models/registers");
var cookieParser=require("cookie-parser");
app.use(cookieParser());

const auth=async (req,res,next)=>{
        try {
            const token=req.cookies.jwt;
            const verifyUser=jwt.verify(token,process.env.SECRET_KEY);
            console.log(verifyUser);
            const user= await Register.findOne({_id:verifyUser._id});
            req.token=token;
            req.user=user;
            next();

        } catch (error) {
            res.render("login.hbs",{msg:'LogIn First'});
        }
}

module.exports=auth;