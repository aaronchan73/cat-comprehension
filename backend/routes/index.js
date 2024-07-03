const express = require('express');
const router = express.Router();
const { userController, questionController } = require('../controllers')

// Users
router.post('/users/register', userController.AddStudent);
router.get('/users', userController.GetStudents);

// Questions
router.get('/questions', questionController.GetQuestions);
router.get('/questions/:id', questionController.GetQuestionsById);

module.exports = router;