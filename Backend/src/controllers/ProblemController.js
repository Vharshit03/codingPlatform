const {getProblemId,batchSubmit} = require("../utils/problemUtility")

const createProblem = async (req,res)=>{

    try{

        const {title,description,difficulty,tags,visibleTestcase,hiddenTestcase,startcode,referenceSolution,problemCreator} = req.body

        for(const {language,completeCode} of referenceSolution ){

            const languageId = getProblemId(language)

            

                //source_code
                //language_id
                //stdin
                //expected_output

                const submissions = visibleTestcase.map((input,output) =>(
                    {
                        "source_code":completeCode,
                        "language_id":languageId,
                        "stdin":input,
                        "expected_output":output
                    }
                ))

                const Batchresult = await batchSubmit(submissions)
            


        }
       
    }
    catch(err){
        console.log("Error:",err)
    }
}