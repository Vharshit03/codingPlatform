const redis = require('redis')

const redisClient = redis.createClient({
    username: 'default',
    password:  process.env.REDIS_KEY,
    socket: {
        host: 'redis-10589.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 10589
    }
});

module.exports = redisClient