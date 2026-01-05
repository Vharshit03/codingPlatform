const express = require("express")
const admin = require("../middleware/adminMiddleware")
const ProblemRouter = express.Router();


//admin accessa apis
ProblemRouter.post('/create',admin,problemCreate)
ProblemRouter.patch('/:id',admin,UpdateProblem)
ProblemRouter.delete('/:id',admin,removeProblem)

ProblemRouter.get('/:id',fetchProblem)
ProblemRouter.get('/',fetchAllProblem)
ProblemRouter.get('/user',solvedProblem)
