const fs = require('fs');
const path = require('path');

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

// Pull the LLM from the Ollama API
const pullModel = async () => {
    const ollamaPullUrl = 'http://localhost:11434/api/pull';
    console.log("Pulling model from Ollama");

    try {
        const response = await fetch(ollamaPullUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'deepseek-coder'
            })
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        await new Promise(resolve => setTimeout(resolve, 30000));
    } catch (error) {
        console.error(error.message);
    }
};

// Generate code based off the description using the Ollama API
const generateCode = async (description) => {
    const ollamaGenerateUrl = 'http://localhost:11434/api/generate';
    console.log("Generating code from description");

    try {
        const response = await fetch(ollamaGenerateUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-coder',
                prompt: `Using this description of how a function works, generate runnable JavaScript code based on the description: ${description}`,
                stream: false
            })
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        return json;
    } catch (error) {
        console.error(error.message);
    }
};

// Pull model and convert code
const getConvertedCode = async (description) => {
    try {
        await pullModel();
        const json = await generateCode(description);
        console.log("Generated JSON: ", json);
        return json;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

// Adds a user’s answer and performance to the corresponding code sample
exports.AddAttempt = async (req, res) => {
    // Get the description, send it to LLM, run it against the test cases
    try {
        const { username, description, questionId } = req.body;

        if (!description) {
            return res.status(400).json({message: "'Description is required"});
        }

        const code = await getConvertedCode(description);
        console.log("Generated code: ", code);
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