const express = require('express')
const AuthMiddleware = require('../middleware/authUser')
const {submitCode,runCode} = require('../controllers/userSubmission')
const submitRouter = express.Router()


submitRouter.post('/submit/:problemId',AuthMiddleware,submitCode)
submitRouter.post('/run/:id',AuthMiddleware,runCode)


module.exports = submitRouter