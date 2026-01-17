const User = require("../model/user")
const jwt = require('jsonwebtoken')
const redisClient = require("../config/redis")


const adminMiddleware = async (req,res,next)=>{

    try{
        const {token} = req.cookies
        if(!token)
        throw new Error("Token does'nt exist,Please Login Again")

        const payload = jwt.verify(token,process.env.JWT_SECRETKEY)

        const {_id} = payload
        if(!_id)
        throw new Error("_id is missing")

        const user = await User.findById(_id)
        if(!user)
        throw new Error("User does'nt exist")

        if(user.role!='admin')
        return res.status(403).send("Invalid Access")


        const IsBlocked = await redisClient.exists(`token:${token}`)
        if(IsBlocked)
        throw new Error("User Invalid token")

        req.results = user;
        
        next()
        
    }
    catch(err)
    {
         console.error(err);
        res.send("Error:"+err)
    }
}

module.exports = adminMiddleware