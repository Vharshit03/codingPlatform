import axios from 'axios';



const getProblemId = (language)=>{

    const problemId = {
    'c++':105,
    'java':62,
    'javascript':63
    }

    return problemId[language.ToLowerCase()];
}


async function batchSubmit(submissions) {

    const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        base64_encoded: 'true'
    },
    headers: {
        'x-rapidapi-key': 'd437216425msh7b96918801c54b0p1b3f58jsn25fae81a474b',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
    },
    data: {
        submissions
    }
    };

    try{
    const response = await axios.request(options);
    console.log(response.data);
    }catch (error){
    console.error(error);
    }
    
}

module.exports = {getProblemId,batchSubmit}