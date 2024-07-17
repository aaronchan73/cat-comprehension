const fs = require('fs');
const path = require('path');

/**
 * @description Read Attempts.json and parse contents
 * @returns contents of Attempts.json
 */
const readAttemptsJSON = () => {
  const filePath = path.join(__dirname, '../Attempts.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

/**
 * @description Read Questions.json and parse contents
 * @returns contents of Questions.json
 */
const readQuestionsJSON = () => {
    const filePath = path.join(__dirname, '../Questions.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

/**
 * @description Write new data into Attempts.json
 * @param data - contents to update Attempts.json with
 */
const updateAttemptsJSON = (data) => {
    const filePath = path.join(__dirname, '../Attempts.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

/**
 * @description Parse LLM response to only include generated JavaScript code
 * @param response - generated response from LLM
 * @returns parsed response of JavaScript function or empty string on failure
 */
const parseCode = (response) => {
    const codeStart = '```javascript';
    const codeEnd = '```';
    const indexStart = response.indexOf(codeStart);
    const indexEnd = response.indexOf(codeEnd, indexStart + codeStart.length);
    
    if (indexStart !== -1 && indexEnd !== -1) {
        // Find JavaScript code block
        const trimmedCode = response.substring(indexStart + codeStart.length, indexEnd).trim();
        return trimmedCode;
    } else {
        return '';
    }
}

/**
 * @description Generate code based off the description using the Ollama API
 * @param description - user description of code to comprehend 
 * @param question - code to comprehend
 * @returns JSON of generated code from LLM
 * @throws error on fetch failures
 */
const generateCode = async (description, question) => {
    const ollamaGenerateUrl = 'http://host.docker.internal:11434/api/generate';
    const generatePrompt = `Generate runnable JavaScript code based on the following description: ${description}.
                            Use the same parameters and return value as this function: ${question}.
                            Do not call the function.
                            Do not include comments in the response.
                            Do not provide any example usage or tests.
                            Do not include any console.log statements. If the function has a return value, ensure it is returned.
                            Only include the JavaScript code in your response.
                            Ensure the function is returned as a one-line string in the form: "function name(params) {}"
                            and properly formatted to be executed using eval.`
    console.log("Generating code from description");

    try {
        // Generate code from LLM
        const response = await fetch(ollamaGenerateUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'tinyllama',
                prompt: generatePrompt,
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
        throw error;
    }
};

/**
 * @description Adds a user’s answer and performance to the corresponding code sample
 * @param req - request of API
 * @param res - response of API
 * @returns - 200 for success, 400 for failure
 */
exports.AddAttempt = async (req, res) => {
    // Get the description, send it to LLM, run it against the test cases
    try {
        const { username, description, questionId } = req.body;
        const { attemptId } = req.params;

        if (!description) {
            return res.status(400).json({message: "Description is required"});
        }

        // Get questions and find the specific question matching the given ID
        const questions = readQuestionsJSON();
        const question = questions.find(q => q.id == questionId);
        
         // Get tests and find the specific test matching the given ID
        const tests = readAttemptTestsJSON();
        const test = tests.find(t => t.id == questionId);

        // Generate code from LLM
        const code = await generateCode(description, question.code);
        if (code === undefined) {
            return res.status(400).json({message: "Error generating code from Ollama"});
        }

        // Parse code from response
        const parsedCode = parseCode(code);
        console.log("Generated code: ", parsedCode);
        if (parsedCode === undefined || parsedCode === '') {
            return res.status(400).json({message: "Error parsing code from Ollama"});
        }

        // Run test cases on generated code
        const testResults = testAttempt(parsedCode, test.testCases);
        console.log("Test results: ", testResults);
        const overallPassed = testResults.every(t => t.passed);
        const numPassed = testResults.filter(t => t.passed).length;

        const result = {
            username: username,
            success: overallPassed,
            message: overallPassed ? "All tests passed" : "Tests failed",
            attemptId: attemptId,
            questionId: questionId,
            generateCode: parsedCode,
            numPassed: numPassed,
        }

        // Update Attempts.json for persistence
        const attempts = readAttemptsJSON();
        attempts.push(result);
        updateAttemptsJSON(attempts);

        res.status(200).json({ message: 'Tests successfully ran', result });
    } catch(error) {
        console.log("Adding attempt error ", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @description Read Attempt-Tests.json and parse contents
 * @returns contents of Attempt-Tests.json
 */
const readAttemptTestsJSON = () => { 
    const filePath = path.join(__dirname, '../Attempt-Tests.json'); 
    const data = fs.readFileSync(filePath, 'utf8'); 
    return JSON.parse(data); 
}; 

/**
 * @description Tests the user's answer (translated into code) against pre-written test cases 
 * @param userCode - code that the user generates from the LLM
 * @param testCases - test cases to run the code on
 * @returns JSON representing the feedback from the tests
 */
const testAttempt = (userCode, testCases) => { 
    const feedback = testCases.map(testCase => {
        const { input, expectedOutput, successMessage, errorMessage } = testCase; // extract these fields from JSON 
        let actualOutput; 

        try {
            // Run generated code from LLM
            const func = eval(`(${userCode})`); 
            actualOutput = func(...JSON.parse(`[${input}]`)); 
        } catch (error) { 
            actualOutput = error.message; 
        }

        // Check test case
        const passed = JSON.stringify(actualOutput) === JSON.stringify(JSON.parse(expectedOutput));   

        return { // return clear feedback 
            input, 
            expectedOutput, 
            actualOutput, 
            message : passed ? successMessage : errorMessage,
            passed,
        }; 
    }); 

    return feedback;
}; 

/**
 * @description Gets a list of all the attempts in in the application for the username provided
 * @param req - request of API
 * @param res - response of API
 */
exports.GetAttemptsByUsername = (req, res) => {
    const { username } = req.params;

    // Get attempts and find the specific attempt matching the given username
    const attempts = readAttemptsJSON();
    const userAttempts = attempts.filter(attempt => attempt.username === username);

    if (userAttempts.length > 0) {
        res.status(200).json({ message: 'Attempt retrieved successfully', userAttempts });
    } else {
        res.status(400).json({ message: 'Attempt not found' });
    }
}

// Export the helper functions for testing
exports.readAttemptsJSON = readAttemptsJSON;
exports.readQuestionsJSON = readQuestionsJSON;
exports.updateAttemptsJSON = updateAttemptsJSON;
exports.parseCode = parseCode;
exports.generateCode = generateCode;
exports.readAttemptTestsJSON = readAttemptTestsJSON;
exports.testAttempt = testAttempt;