const mongoose = require('mongoose');
const {Schema} = mongoose;

const submissionSchema = new Schema({
    userID:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    problemID:{
        type:Schema.Types.ObjectId,
        ref:'problem',
        required:true
    },
    language:{
        type:String,
        enum:['c++','java','javascript'],
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Compilation Error","TLE"],
        required:true
    },
    SubmittedCode:{
        type:String,
        required:true
    },
    runTime:{
        type:Number,
        required:true
    },
    memory:{
        type:String,
        required:true
    },
    TestCasesPassed:{
        type:Number
    },
    TotalTestCases:{
        type:Number
    },
    Error_msg:{
        type:String
    }
},{
    timestamps:true
})

const Submission = mongoose.model("submission",submissionSchema)
module.exports = Submission