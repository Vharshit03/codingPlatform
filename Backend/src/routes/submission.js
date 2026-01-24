const express = require('express')
const AuthMiddleware = require('../middleware/authUser')
const {submitCode,runCode,submittedProblems} = require('../controllers/userSubmission')
const authMiddleware = require('../middleware/authUser')
const rateLimiter = require("../middleware/Ratelimiter")
const submitRouter = express.Router()


submitRouter.post('/submit/:problemId',AuthMiddleware,rateLimiter,submitCode)
submitRouter.post('/run/:id',AuthMiddleware,rateLimiter,runCode)
submitRouter.get('/submittedProblems/:pId',authMiddleware,submittedProblems)

module.exports = submitRouter