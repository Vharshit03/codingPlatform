const Validate = require("../utils/validator")
const User = require("../model/user")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const redisClient = require("../config/redis")


//register user
const register = async (req,res)=>{

    try{
        
        Validate(req.body)
        const {emailId,password} = req.body
        req.body.role ='user'

        req.body.password = await bcrypt.hash(password,10)

        const user = await User.create(req.body)
        const token = jwt.sign({_id:user._id,email:emailId,role:user.role},process.env.JWT_SECRETKEY,{expiresIn: 60*60})

        res.cookie('token',token,{maxAge: 60*60*100});
        res.status(201).json({
            user:{
                _id: user._id,
               firstName:user.firstName,
               emailId:user.emailId
            },
            message:"User registered Successfully"
        })

    }
    catch(err){
       res.send("Error:"+err)
    }
}

//login user
const login = async (req,res)=>{

    try{
    
        const {emailId,password} = req.body

        if(!emailId)
            throw new Error("Invalid Credentials")
        if(!password)
            throw new Error("Invalid Credentials")

        const user = await User.findOne({emailId});
        if(!user)
            throw new Error("User does'nt Exist")

        const isMatch =  await bcrypt.compare(password,user.password);

        if(!isMatch)
            throw new Error("Invalid Credentials")

        const token = jwt.sign({_id:user._id,email:emailId,role:user.role},process.env.JWT_SECRETKEY,{expiresIn: 60*60})
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(200).json({
            user:{
                _id: user._id,
               firstName:user.firstName,
               emailId:user.emailId
            },
            message:"Login Successfull"
        })
    }
    catch(err)
    {
        res.status(401).send("Error:"+err)
    }
}

//logout user
const logout = async (req,res)=>{
    
     try{
        const {token} = req.cookies;
        const payload = jwt.decode(token)

        await redisClient.set(`token:${token}`,"Blocked")
        await redisClient.expireAt(`token:${token}`,payload.exp)

        res.cookie('token',null,{expires: new Date(Date.now())})
        res.status(200).send("logout Successfully")
     }
     catch(err)
     {
        console.log("Error:"+err)
     }
}


const adminRegister = async (req,res)=>{

    try{


        Validate(req.body)
        const {firstName,emailId,password} = req.body

        req.body.password = await bcrypt.hash(password,10)

        const user = await User.create(req.body)
        const token = jwt.sign({_id:user._id,email:emailId,role:user.role},process.env.JWT_SECRETKEY,{expiresIn: 60*60})

        res.cookie('token',token,{maxAge: 60*60*100});
        res.status(201).json({
            user:{
                _id: user._id,
               firstName:user.firstName,
               emailId:user.emailId
            },
            message:"User registered Successfully"
        })

    }
    catch(err){
       res.send("Error:"+err)
    }
}

const deleteProfile = async()=>{

    try{
        const userId = req.results._id;

        await User.findByIdAndDelete(userId)

        res.status(200).send("Profile deleted successfully")
    }
    catch(err){
        res.status(500).send("Error:"+err)
    }
}

module.exports = {register,login,logout,adminRegister,deleteProfile}