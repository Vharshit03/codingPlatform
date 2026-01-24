const redisClient = require("../config/redis")


const rateLimiter = async (req,res,next)=>{

    try{
        const cooldown = `submit_cooldown:${req.results._id}`

        const ttl = await redisClient.ttl(cooldown)

        if(ttl>0){
            return res.status(429).json({
                error: "Please wait before submitting again",
                retryAfter: ttl,
                message: `Wait ${ttl} seconds then submit again`
                });
        }

        //set cooldown
        await redisClient.set(cooldown,'cooldown_Active',{
            EX:10, //exp in second
            NX:true //onlu sets if key does'nt exist
        })
    

        next()
    }
    catch(err){
        console.error("Rate limiter error:", err);
        res.status(500).send("Rate limiter Error:"+err)
    }
}

module.exports = rateLimiter