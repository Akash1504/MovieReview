const mongoose = require('mongoose')
const Comment=require('./Comment');
const Schema = mongoose.Schema

const Movie = new Schema(
    {
       
        name: 
            {
             type: String, 
             required: true 
            },
            
       
       
    comments:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Comment'
                }
            ],
         
        
    },
  
    {
         toJSON:{
                    virtuals:true,
                },
        

    });

module.exports = mongoose.model('movie', Movie)