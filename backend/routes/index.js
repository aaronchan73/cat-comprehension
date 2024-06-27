const express = require('express');
const router = express.Router();
const { userController } = require('../controllers')

router.post('/users/register', userController.AddStudent);
router.get('/users', userController.GetStudents);

module.exports = router;