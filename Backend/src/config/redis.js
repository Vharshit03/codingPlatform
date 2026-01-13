const redis = require('redis')

const redisClient = redis.createClient({
    username:  'default',
    password:  process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-17328.crce263.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 17328
    }
});

module.exports = redisClient