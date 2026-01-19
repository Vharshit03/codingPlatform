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
        enum:["Pending","Accepted","Wrong","Compilation Error","TLE"],
        required:true
    },
    SubmittedCode:{
        type:String,
        required:true
    },
    runTime:{
        type:Number,
        default:0
    },
    memory:{
        type:Number,
        default:0
    },
    TestCasesPassed:{
        type:Number,
        default:0
    },
    TotalTestCases:{
        type:Number,
        default:0
    },
    Error_msg:{
        type:String
    }
},{
    timestamps:true
})

const Submission = mongoose.model("submission",submissionSchema)
module.exports = Submission