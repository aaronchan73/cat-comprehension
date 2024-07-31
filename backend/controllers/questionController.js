const fs = require('fs');
const path = require('path');

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
 * @description Returns all available code questions
 * @param req - request of API
 * @param res - response of API
 */
exports.GetQuestions = (req, res) => {
    const questions = readQuestionsJSON();
    res.status(200).json({ message: 'Questions retrieved successfully', questions });
};

/**
 * @description Retrieves a specific question by ID
 * @param req - request of API
 * @param res - response of API
 */
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