const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        minLength:5,
        macLength:20
    },
    role:{
        type:String,
        enum:["user","admin"],
        required:true
    },
    emailId:{
        type:String,
        unique:true,
        imutable:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    problemSolved:{
        type:[{
            type:mongoose.Schema.ObjectId,
            ref:'problem',
        }],
        unique:true
    }
},{
    timestamps:true
})

UserSchema.post("findOneAndDelete",async function(doc){
    if(doc){
    await mongoose.model('submission').deleteMany({userID:doc._id})
    
    console.log(`Data deleted for the user:${doc._id}`)
    }
})

const User = mongoose.model('user',UserSchema)
module.exports = User