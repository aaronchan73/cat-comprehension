const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

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

const getConvertedCode = async (description) => {
    const ollamaPullUrl = 'http://127.0.0.1:11434/api/pull';
    const ollamaGenerateUrl = 'http://127.0.0.1:11434/api/generate';

    try {
        // Pull the model
        const pullResponse = await fetch(ollamaPullUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'name': 'deepseek-coder'
            })
        });

        if (!pullResponse.ok) {
            throw new Error(`Pull request failed with status: ${pullResponse.status}`);
        }

        // Generate code
        const generateResponse = await fetch(ollamaGenerateUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'model': 'deepseek-coder',
                'prompt': `Using this description of how a function works, generate runnable JavaScript code based on the description: ${description}`
            })
        });

        if (!generateResponse.ok) {
            throw new Error(`Generate request failed with status: ${generateResponse.status}`);
        }

        const json = await generateResponse.json();

        return json;
    } catch (err) {
        console.error("Error during conversion process:", err);
        throw err; // Re-throw the error after logging it
    }
};

// Adds a user’s answer and performance to the corresponding code sample
exports.AddAttempt = (req, res) => {
    // get the description, send it to LLM, run it against the test cases
    try {
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({message: "'Description is required"});
        }

        const code = getConvertedCode(description);
        console.log(code);
        res.status(200).json({ message: 'Code received from Ollama', code });
    } catch(error) {
        console.log("Adding attempt error ", err);
        res.status(500).json({ message: 'Internal server error' });
    }
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
        const { input, expectedOutput, successMessage, errorMessage } = testCase; 
        let actualOutput; 

        try { 
            const func = eval(`(${userCode})`); 
            actualOutput = func(...JSON.parse(`[${input}]`)); 
        } catch (error) { 
            actualOutput = error.message; 
        } 

        const passed = JSON.stringify(actualOutput) === JSON.stringify(JSON.parse(expectedOutput));   

        return { 
            input, 
            expectedOutput, 
            actualOutput, 
            message : passed ? successMessage : errorMessage
    
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