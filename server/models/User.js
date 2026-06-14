const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Name is Required'],
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:6
    }

},{timestamps:true});

module.exports = mongoose.model('User', userSchema);