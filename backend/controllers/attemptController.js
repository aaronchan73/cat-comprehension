const fs = require('fs');
const path = require('path');
const { stringify } = require('querystring');
const axios = require('axios');


// Read Attempts.json and parse contents
const readAttemptsJSON = () => {
  const filePath = path.join(__dirname, '../Attempts.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Write new data into Attempts.json
const updateAttemptsJSON = (data) => {
    const filePath = path.join(__dirname, '../Attempts.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

getConvertedCode = (description) => {
    try {

        const response = await axios.post('http://localhost:8080/api/generate', {
            'model':'llama3',
            'prompt':'Using this description of how a function works, generate runnable javascript code based on the code' + description
        });

        res.status(200).json({message:'Successfully added attempt', code: response})
    } catch(err) {
        console.log("Adding attempt error ", err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Adds a user’s answer and performance to the corresponding code sample
exports.AddAttempt = (req, res) => {
    // TODO
    // get the description, send it to LLM, run it against the test cases
    try {
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({message: "'Description is required"});
        }

        const code = getConvertedCode(description);
        console.log(code);
    } catch(error) {
        console.log("Adding attempt error ", err);
        res.status(500).json({ message: 'Internal server error' });
    }
    return;

};

// Read Attempt-Tests.json and parse contents
const readAttemptTestsJSON = () => { 
    const filePath = path.join(__dirname, '../Attempt-Tests.json'); 
    const data = fs.readFileSync(filePath, 'utf8'); 
    return JSON.parse(data); 
}; 

// Tests the user's answer (translated into code) against pre-written test cases 
const testAttempt = (userCode, testCases) => { 
    const feedback = testCases.map(testCase => {
        const {input, expectedOutput} = testCase; 
        let actualOutput; 

        try { 
            const func = eval('(${userCode})'); 
            actualOutput = func(...JSON.parse('[${input}]')); 
        } catch (error) { 
            actualOutput = error.message 
        } 

        return { 
            input, 
            expectedOutput, 
            actualOutput, 
            passed: JSON.stringify(ActualOutput) === JSON.stringify(JSON.parse(expectedOutput))
        }; 
    }); 

    return feedback;
}; 

// Gets a list of all the attempts in in the application for the username provided
exports.GetAttemptsByUsername = (req, res) => {
    const { username } = req.params.username;

    // Get attempts and find the specific attempt matching the given username
    const attempts = readAttemptsJSON();
    const attempt = attempts.find(a => a.user === username);

    if (attempt) {
        res.status(200).json({ message: 'Attempt retrieved successfully', attempt });
    } else {
        res.status(400).json({ message: 'Attempt not found' });
    }
}