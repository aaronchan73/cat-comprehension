const fs = require('fs');
const path = require('path');

// Read Attempts.json and parse contents
const readAttemptsJSON = () => {
  const filePath = path.join(__dirname, '../Attempts.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Read Questions.json and parse contents
const readQuestionsJSON = () => {
    const filePath = path.join(__dirname, '../Questions.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

// Write new data into Attempts.json
const updateAttemptsJSON = (data) => {
    const filePath = path.join(__dirname, '../Attempts.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Generate code based off the description using the Ollama API
const generateCode = async (description, question) => {
    const ollamaGenerateUrl = 'http://host.docker.internal:11434/api/generate';
    console.log("Generating code from description");

    try {
        const response = await fetch(ollamaGenerateUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-coder',
                prompt: `Generate runnable JavaScript code based on the following description: ${description}. Use the same function signature as this function: ${question}. Only include the JavaScript code in your response, without any additional text or comments.`,
                stream: false
            })
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        return json.response;
    } catch (error) {
        console.error(error.message);
    }
};

// Adds a user’s answer and performance to the corresponding code sample
exports.AddAttempt = async (req, res) => {
    // Get the description, send it to LLM, run it against the test cases
    try {
        const { username, description, questionId } = req.body;

        if (!description) {
            return res.status(400).json({message: "Description is required"});
        }

        // Get questions and find the specific question matching the given ID
        const questions = readQuestionsJSON();
        const question = questions.find(q => q.id === questionId);

        const code = await generateCode(description, question.code);

        if (code === undefined) {
            return res.status(400).json({message: "Error generating code from Ollama"});
        }
        console.log("Generated code: ", code);
        res.status(200).json({ message: 'Code received from Ollama', code });
    } catch(error) {
        console.log("Adding attempt error ", error);
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