const {getProblemId,batchSubmit,tokenSubmit} = require("../utils/problemUtility")
const Problem = require('../model/problem')

const createProblem = async (req,res)=>{

    const {title,description,difficulty,tags,visibleTestcase,hiddenTestcase,startcode,referenceSolution,problemCreator} = req.body

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

module.exports = {createProblem}