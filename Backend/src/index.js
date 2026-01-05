const express = require('express')
const cookieParser = require('cookie-parser')
const main = require('./config/db.js')
const redisClient = require('./config/redis.js')
const AuthRouter = require('./routes/userAuth.js')

const app = express()
require('dotenv').config()

app.use(express.json())
app.use(cookieParser());

app.use("/user",AuthRouter)

const InitializeConnection = async function (){
 
  try{

    await Promise.all([main(),redisClient.connect()])
    console.log("redis and MongoDb connected")

    app.listen(process.env.PORT_NUMBER,()=>{
    console.log("listening at Port number:",process.env.PORT_NUMBER)
  })
 }
  catch(err){
    console.log("Error:"+err)
  }
}

InitializeConnection()