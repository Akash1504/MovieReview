
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validate=require('validator');
const employeeSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
       
    },
    confirmpassword:{
        type:String,
        required:true
       
    },
    gender:{
        type:String,
        required:true
    },
   
    email:{
        type:String,
        required:true
   

    },
    
    phone:{
        type:Number,
        required:true
        
    },
    role:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


employeeSchema.methods.generateAuthToken=async function(){
    try {
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token})
        await this.save();
            return token;
    } catch (error) {
        res.send(error);
    }
}

employeeSchema.pre("save", async function (next) {
   
 if (this.isModified("password") || this.isNew) {
        this.password=await bcrypt.hash(this.password,10);
        this.confirmpassword=await bcrypt.hash(this.password,10);
        // this.confirmpassword=undefined;
    }
    next();
  })
const Register=new mongoose.model("Register",employeeSchema);
module.exports=Register;
