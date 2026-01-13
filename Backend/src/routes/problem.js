const express = require("express")
const admin = require("../middleware/adminMiddleware")
const {createProblem,updateProblem,removeProblem,fetchProblem,fetchAllProblem} = require("../controllers/ProblemController")

const ProblemRouter = express.Router();

//admin accessa apis
ProblemRouter.post('/create',admin,createProblem)
ProblemRouter.patch('/update/:id',admin,updateProblem)
ProblemRouter.delete('/delete:id',admin,removeProblem)

ProblemRouter.get('/:id',fetchProblem)
ProblemRouter.get('/getAllProblem',fetchAllProblem)
// ProblemRouter.get('/SolvedProblemByuser',solvedProblem)


module.exports = ProblemRouter
