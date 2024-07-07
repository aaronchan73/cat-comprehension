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

// Adds a user’s answer and performance to the corresponding code sample
exports.AddAttempt = (req, res) => {
    // TODO 
};

// Tests the user's answer (translated into code) against pre-written test cases 
exports.TestAttempt = () => { 
    // TODO
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