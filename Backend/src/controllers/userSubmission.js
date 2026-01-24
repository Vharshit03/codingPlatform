const Problem = require('../model/problem')
const {getProblemId,batchSubmit,tokenSubmit} = require('../utils/problemUtility')

const Submission = require('../model/submission')

const submitCode = async (req,res) => {

    const {language,solutionCode} = req.body
    const {problemId} = req.params


    try{

        const problem = await Problem.findById(problemId)
        const hiddenTestcase = problem._doc.hiddenTestcase

        const _id = req.results._id
        const languageId = getProblemId(language)

        const submission = await Submission.create({
           userID:_id,
           problemID:problemId,
           language,
           status:"Pending",
           SubmittedCode:solutionCode,
           TotalTestCases:hiddenTestcase.length
        })

        const submissions = hiddenTestcase.map((submit) =>(
                {
                    "source_code":solutionCode,
                    "language_id":languageId,
                    "stdin":submit.input,
                    "expected_output":submit.output
                }
        ))

        const Batchresult = await batchSubmit(submissions)

        const resultToken = Batchresult.map((res)=> res.token).join(',')

        const Result = await tokenSubmit(resultToken);

        let runTime = 0;
        let memory = 0
        let passedTestCases = 0
        let stdErr = "NA";
        let status = "Accepted"

        const expectedOutput = hiddenTestcase.map((test) =>test.output )
        const output = Result.map((res)=> res.stdout);

        for(const test of Result){
            if(test.status_id!=3){
            stdErr = test.stderr
            status = test.status.description
            return res.status(400).json({
                msg:stdErr,
                output,
                expectedOutput,
                passedTestCases,
                TotalTestCases:Result.length
            }) }

            passedTestCases++
            runTime += parseFloat(test.time)
            memory = Math.max(memory,test.memory)
        }

        // submission.status = status
        // submission.runTime = runTime
        // submission.memory = memory
        // submission.TestCasesPassed = passedTestCases
        // submission.Error_msg = stdErr

        // await submission.save();


        await submission.updateOne({
            status,
            runTime,
            memory,
            TestCasesPassed:passedTestCases,
            TotalTestCases:Result.length,
            Error_msg:stdErr
        })


        if(!req.results.problemSolved.includes(problemId)){
          req.results.problemSolved.push(problemId)
          await req.results.save()
        }

        res.status(201).json({
            msg:"Code Submitted Successfully",
            output,
            expectedOutput,
            passedTestCases,
            TotalTestCases:Result.length,
            runTime,
            memory,
            status
        })



    }
    catch(err){
        res.status(500).send("Error:"+err)
    }
}

const runCode = async (req,res) => {

    const {language,solutionCode} = req.body
    const {id} = req.params

    try{
        
        const problem = await Problem.findById(id)

        const languageId = getProblemId(language)

        const submissions = problem._doc.visibleTestcase.map((submit) =>(
            {
                "source_code":solutionCode,
                "language_id":languageId,
                "stdin":submit.input,
                "expected_output":submit.output
            }
        ))

        const Batchresult = await batchSubmit(submissions)

        const resultToken = Batchresult.map((res)=> res.token).join(',')

        const Result = await tokenSubmit(resultToken);


        const RunResult = Result.map((test)=>{
            return {
                input: test.stdin,
                output:test.stdout.replace("\n",""),
                expected_output:test.expected_output,
                status:test.status.description
            }
        })

        res.status(200).send(RunResult)


    }
    catch(err){
        res.status(500).send("Error:"+err)
    }

}

const submittedProblems = async()=>{

    try{
        const userID = req.results._id
        const problemID = req.params.pId
        const submitproblems = await Submission.find({userID,problemID})

        if(!submitproblems){
        return res.status(404).send("NO submitted problemsfound")
        }

        res.status(200).send(submitproblems)
    }
    catch(err){
        res.status(500).send("Error:"+err)
    }
}

module.exports = {submitCode,runCode,submittedProblems}

// {
//     source_code: "const input = require('fs').readFileSync(0,'utf-8').trim()\n" +
//       " const [a,b] = input.split(' ').map(Number);\n" +
//       'console.log(a+b);',
//     language_id: 63,
//     stdin: '5 3',
//     expected_output: '8',
//     stdout: '8\n',
//     status_id: 3,
//     created_at: '2026-01-17T15:24:39.728Z',
//     finished_at: '2026-01-17T15:24:40.001Z',
//     time: '0.017',
//     memory: 6956,
//     stderr: null,
//     token: '78de5f96-adc0-46e7-8fb3-586d4b78836d',
//     number_of_runs: 1,
//     cpu_time_limit: '5.0',
//     cpu_extra_time: '1.0',
//     wall_time_limit: '10.0',
//     memory_limit: 256000,
//     stack_limit: 64000,
//     max_processes_and_or_threads: 128,
//     enable_per_process_and_thread_time_limit: false,
//     enable_per_process_and_thread_memory_limit: false,
//     max_file_size: 5120,
//     compile_output: null,
//     exit_code: 0,
//     exit_signal: null,
//     message: null,
//     wall_time: '0.032',
//     compiler_options: null,
//     command_line_arguments: null,
//     redirect_stderr_to_stdout: false,
//     callback_url: null,
//     additional_files: null,
//     enable_network: false,
//     post_execution_filesystem: 'UEsDBBQACAAIABR7MVwAAAAAAAAAAHkAAAAJABwAc2NyaXB0LmpzVVQJAAO3qWtpt6lraXV4CwABBOgDAAAE6AMAAB2Muw7CMAwA936FtziiRIxIFSsjCyPqkAQXRcoLxxn694Sup7vzJTeBkGsXuAHTtwcmVFtT2jDZ9z1Eeu7Z42VWXbbzdXDhkFBP4I/2ZWe3jvZ4mFZjEFQwtGQrPnpyxHqZ/m6JZGL5oD05vfwAUEsHCN+xvHNuAAAAeQAAAFBLAQIeAxQACAAIABR7MVzfsbxzbgAAAHkAAAAJABgAAAAAAAEAAACkgQAAAABzY3JpcHQuanNVVAUAA7epa2l1eAsAAQToAwAABOgDAABQSwUGAAAAAAEAAQBPAAAAwQAAAAAA',
//     status: { id: 3, description: 'Accepted' },
//     language: { id: 63, name: 'JavaScript (Node.js 12.14.0)' }
//   },