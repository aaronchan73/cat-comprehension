const fs = require('fs');
const path = require('path');

/**
 * @description Read Attempts.json and parse contents
 * @returns contents of Attempts.json
 */
const readAttemptsJSON = () => {
    const filePath = path.join(__dirname, '../data/Attempts.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

/**
 * @description Read Questions.json and parse contents
 * @returns contents of Questions.json
 */
const readQuestionsJSON = () => {
    const filePath = path.join(__dirname, '../data/Questions.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

/**
 * @description Write new data into Attempts.json
 * @param data - contents to update Attempts.json with
 */
const updateAttemptsJSON = (data) => {
    const filePath = path.join(__dirname, '../data/Attempts.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

/**
 * @description Parse LLM response to only include generated JavaScript code
 * @param response - generated response from LLM
 * @returns parsed response of JavaScript function or empty string on failure
 */
const parseCode = (generatedCode) => {
    const response = generatedCode.replace(/```js/g, '```javascript');
    const codeStart = '```javascript';
    const codeEnd = '```';
    const indexStart = response.indexOf(codeStart);
    const indexEnd = response.indexOf(codeEnd, indexStart + codeStart.length);
    
    if (indexStart !== -1 && indexEnd !== -1) {
        // Find JavaScript code block
        const trimmedCode = response.substring(indexStart + codeStart.length, indexEnd).trim().replace(/I/g, 'i');
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
const generateCode = async (description) => {
    const ollamaGenerateUrl = 'http://host.docker.internal:11434/api/generate';
    const generatePrompt = `Please write code in JS and create a function based on the following description: "${description}". Dont include any logs. Do not use es6 arrow functions.`;

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
        console.log(response)
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
            return res.status(400).json({ message: "Description is required" });
        }

        // Get questions and find the specific question matching the given ID
        const questions = readQuestionsJSON();
        const question = questions.find(q => q.id == questionId);

        // Get tests and find the specific test matching the given ID
        const tests = readAttemptTestsJSON();
        const test = tests.find(t => t.id == questionId);

        // Generate code from LLM
        const code = await generateCode(description);
        console.log("Generated code: ", code);
        if (code === undefined) {
            return res.status(400).json({ message: "Error generating code from Ollama" });
        }

        // Parse code from response
        const parsedCode = parseCode(code);
        console.log("Parsed code: ", parsedCode);
        if (parsedCode === undefined || parsedCode === '') {
            return res.status(400).json({ message: "Error parsing code from Ollama" });
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
            testResults: testResults,
        }

        // Update Attempts.json for persistence
        const attempts = readAttemptsJSON();
        attempts.push(result);
        updateAttemptsJSON(attempts);

        res.status(200).json({ message: 'Tests successfully ran', result });
    } catch (error) {
        console.log("Adding attempt error ", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @description Read Attempt-Tests.json and parse contents
 * @returns contents of Attempt-Tests.json
 */
const readAttemptTestsJSON = () => {
    const filePath = path.join(__dirname, '../data/Attempt-Tests.json');
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
        const { test, input, expectedOutput, successMessage, errorMessage } = testCase; // extract these fields from JSON 
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
            test,
            input,
            expectedOutput,
            actualOutput,
            message: passed ? successMessage : errorMessage,
            passed,
        };
    });

    console.log(feedback)

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

/**
 * @description Generate feedback based on attempt's results using the Ollama API
 * @param attempts - previous attempt from the user
 * @returns JSON of generated feedback from LLM
 * @throws error on fetch failures
 */
const generateFeedback = async (attempt, question) => {
    const code = attempt.generateCode;
    const testResults = JSON.stringify(attempt.testResults);
    const jsStart = "```javascript\n"
    const jsEnd = "```"
    const ollamaGenerateUrl = 'http://host.docker.internal:11434/api/generate';
    const feedbackPrompt = `This is a student's attempt at the ${question.name} question: 
                        ${jsStart}${code}${jsEnd}. This is the correct code for the same question: ${jsStart}${question.code}${jsEnd}
                        Based on these test results generated by running the student's code ${testResults}, give hints as to 
                        why their code isn't fully passing the tests. Keep hints less than 50 words. `;
    console.log(feedbackPrompt);
    console.log("Generating feedback from attempts", attempt);

    // All tests passed; do not run LLM
    if (attempt.success) {
        return attempt.message;
    }

    try {
        // Generate feedback from LLM
        const response = await fetch(ollamaGenerateUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'tinyllama',
                prompt: feedbackPrompt,
                stream: false,
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
 * @description Generate feedback based on the user's attempt
 * @param req - request of API
 * @param res - response of API
 * @returns - 200 for success, 400 for failure
 */
exports.GetFeedback = async (req, res) => {
    try {
        const { username, attemptId, questionId } = req.params;

        // Get attempts and find the specific attempt matching the given username, questionId, and attemptId
        const attempts = readAttemptsJSON();
        const attempt = attempts.filter(attempt => attempt.username === username && attempt.questionId == questionId && attempt.attemptId == attemptId);
        console.log(attempt)

        const questions = readQuestionsJSON();
        const question = questions.find(q => q.id == questionId);
        console.log(question);

        // Send feedback to LLM
        const feedback = await generateFeedback(attempt[0], question);
        if (feedback === undefined) {
            return res.status(400).json({ message: "Error generating feedback from Ollama" });
        }

        res.status(200).json({ message: 'Feedback successfully generated', feedback });
    } catch (error) {
        console.log("Adding attempt error ", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Export the helper functions for testing
exports.readAttemptsJSON = readAttemptsJSON;
exports.readQuestionsJSON = readQuestionsJSON;
exports.updateAttemptsJSON = updateAttemptsJSON;
exports.parseCode = parseCode;
exports.generateCode = generateCode;
exports.readAttemptTestsJSON = readAttemptTestsJSON;
exports.testAttempt = testAttempt;