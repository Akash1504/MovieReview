const mongoose = require('mongoose')
const Schema = mongoose.Schema

const upcoming = new Schema(
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
            // img:
            // {
            //     data:Buffer,
            //     contentType:String
            // }
        image:{
            type:String
        }
    });

const Upcoming =new mongoose.model('Upcoming', upcoming)

module.exports=Upcoming;
