const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Upcoming = new Schema(
    {
       
        name: 
            {
             type: String, 
             required: true 
            },
           date:
            {
                type: String, 
                required: true
            },
            img:
            {
                data:Buffer,
                contentType:String
            }
        
    },
  
    {
         toJSON:{
                    virtuals:true,
                },
        

    });

module.exports = mongoose.model('upcoming', Upcoming)