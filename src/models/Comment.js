const mongoose = require('mongoose')
const movie=require('./movie-model');
const Schema = mongoose.Schema

const Comment = new Schema(
    {

        name:{
            type: String
        },
        
        text:{
            type: String
        },
        rating:
        { 
            type: Number,
         
        },
       
        movie:{
            type:mongoose.Schema.Types.ObjectId,
             ref:'movie'
        }
     
    }, 
    
        {
        toJSON:{
            virtuals:true,
        },
    
 });

module.exports = mongoose.model('Comment', Comment)