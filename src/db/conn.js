const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/ytRegistrationform",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
   
}).then(()=> {
    console.log(`Connection sussesfull`);
}).catch((e)=>{
    console.log(`Connection failed`);
})