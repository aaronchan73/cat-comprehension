const fs = require('fs');
const path = require('path');

// Read Questions.json and parse contents
const readQuestionsJSON = () => {
  const filePath = path.join(__dirname, '../Questions.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Returns all available code questions
exports.GetQuestions = (req, res) => {
    const questions = readQuestionsJSON();
    res.status(200).json({ message: 'Questions retrieved successfully', questions });
};

// Retrieves a specific question by ID
exports.GetQuestionsById = (req, res) => {
    const id = parseInt(req.params.id);

    // Get questions and find the specific question matching the given ID
    const questions = readQuestionsJSON();
    const question = questions.find(q => q.id === id);

    if (question) {
        res.status(200).json({ message: 'Question retrieved successfully', question });
    } else {
        res.status(400).json({ message: 'Question not found' });
    }
}