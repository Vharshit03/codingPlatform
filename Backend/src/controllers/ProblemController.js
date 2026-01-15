const {getProblemId,batchSubmit,tokenSubmit} = require("../utils/problemUtility")
const Problem = require('../model/problem')
const Submission = require('../model/submission')

const problemCheck = async({referenceSolution,visibleTestcase})=>{

    try {

        for(const {language,completeCode} of referenceSolution ){

            const languageId = getProblemId(language)

            //source_code
            //language_id
            //stdin
            //expected_output

            const submissions = visibleTestcase.map((submit) =>(
                {
                    "source_code":completeCode,
                    "language_id":languageId,
                    "stdin":submit.input,
                    "expected_output":submit.output
                }
            ))

            const Batchresult = await batchSubmit(submissions)

            const resultToken = Batchresult.map((res)=> res.token ).join(',')

            const testResult = await tokenSubmit(resultToken);

            for(const test of testResult){
                if(test.status_id!=3){
                throw new Error("Error Occured: "+ test.stderr)
                }
            }

        }
        
    } catch (error) {
        return ("Error:"+error)
    }
}

const createProblem = async (req,res)=>{

    const {title,description,difficulty,tags,visibleTestcase,hiddenTestcase,startcode,referenceSolution} = req.body

    try{

        for(const {language,completeCode} of referenceSolution ){

            const languageId = getProblemId(language)

            //source_code
            //language_id
            //stdin
            //expected_output

            const submissions = visibleTestcase.map((submit) =>(
                {
                    "source_code":completeCode,
                    "language_id":languageId,
                    "stdin":submit.input,
                    "expected_output":submit.output
                }
            ))

            const Batchresult = await batchSubmit(submissions)

            const resultToken = Batchresult.map((res)=> res.token ).join(',')

            const testResult = await tokenSubmit(resultToken);

            for(const test of testResult){
                if(test.status_id!=3){
                return res.status(400).send("Error Occured: "+ test.stderr)
                }
            }

        }

        const userProblem = await Problem.create({
            ...req.body,
            problemCreator : req.results._id
        })

        res.status(201).send("Problem Saved Sucessfully")
       
    }
    catch(err){
        res.status(400).send("Error:"+ err)
    }
}

const updateProblem = async (req,res)=>{

    const {id} = req.params
    const {title,description,difficulty,tags,visibleTestcase,hiddenTestcase,startcode,referenceSolution} = req.body

    try {

    if(!id)
    res.status(400).send('ID is missing')

    const problem = await Problem.findById(id);

    if(!problem)
    res.status(404).send("Problem does'nt exist")

    const check = await problemCheck(req.body);


    const newProblem = await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true})

    res.status(200).send("Updated Success, new Problem:"+newProblem)

    } 
    catch (err) {
        res.status(500).send("Error:"+err)
    }
    

}

const removeProblem = async (req,res)=>{

    const {id} = req.params


    try {

        if(!id)
        res.status(400).send("ID is missing")

        const problem = await Problem.findById(id)

        if(!problem)
        res.status(404).send("Problem does'nt exist")

        await problem.deleteOne();

        res.status(200).send("Problem deleted succesfully")
        
    } catch (error) {
        res.status(500).send("Error:"+err)
    }

}

const fetchProblem = async(req,res)=>{

    const id = req.params

    try{
        
        const problem = await Problem.findById(id)
        
        if(!problem)
        res.status(404).send("Problem does'nt Exist")

        res.status(200).json({
            message:"Success",
            ...problem,
        })
    }
    catch(err){
        res.status(500).send("Error:"+err)
    }
}

const fetchAllProblem = async()=>{

    try{

        const problems = await Problem.find({})

        if(problems.length==0)
        res.status(404).send("Problem not found")

        res.status(200).json({
            message:"success",
            ...problems
        })
    }
    catch(err){
        res.status(500).send("Error"+err)
    }
}

const solvedProblem = async(req,res)=>{

    try{
        const id = req.results._id;

        const solvedProblems = (await Submission.find({userID:id})).sort({createdAt:-1});

        if(solvedProblem.length==0)
        res.status(400).send("There is no User Solution Exist")

        res.status(200).json({
            message:"Success",
            solutions:solvedProblems
        })
    }
    catch(err){
        res.status(500).send("Error:"+err)
    }
}


module.exports = {createProblem,updateProblem,removeProblem,fetchProblem,fetchAllProblem,solvedProblem}