const express = require("express")
const adminMiddleware = require("../middleware/adminMiddleware")
const userMiddleware = require("../middleware/authUser")
const {createProblem,updateProblem,removeProblem,fetchProblem,fetchAllProblem,solvedProblem} = require("../controllers/ProblemController")

const ProblemRouter = express.Router();

//adminMiddleware accessa apis
ProblemRouter.post('/create',adminMiddleware,createProblem)
ProblemRouter.put('/update/:id',adminMiddleware,updateProblem)
ProblemRouter.delete('/delete/:id',adminMiddleware,removeProblem)

ProblemRouter.get('/',userMiddleware,fetchAllProblem)
ProblemRouter.get('/:id',userMiddleware,fetchProblem)

// ProblemRouter.get('/SolvedProblemByuser',solvedProblem)


module.exports = ProblemRouter
