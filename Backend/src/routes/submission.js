const express = require('express')
const AuthMiddleware = require('../middleware/authUser')
const {submitCode,runCode} = require('../controllers/userSubmission')
const submitRouter = express.Router()


submitRouter.post('/submit',AuthMiddleware,submitCode)
submitRouter.post('/run',AuthMiddleware,runCode)


module.exports = submitRouter