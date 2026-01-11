const express = require("express")
const admin = require("../middleware/adminMiddleware")
const {createProblem} = require("../controllers/ProblemController")

const ProblemRouter = express.Router();

//admin accessa apis
ProblemRouter.post('/create',admin,createProblem)
// ProblemRouter.patch('/:id',admin,UpdateProblem)
// ProblemRouter.delete('/:id',admin,removeProblem)

// ProblemRouter.get('/:id',fetchProblem)
// ProblemRouter.get('/',fetchAllProblem)
// ProblemRouter.get('/user',solvedProblem)


module.exports = ProblemRouter
