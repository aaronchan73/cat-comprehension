const fs = require('fs');
const path = require('path');

/**
 * @description Read Users.json and parse contents
 * @returns contents of Users.json
 */
const readUsersJSON = () => {
  const filePath = path.join(__dirname, '../Users.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

/**
 * @description Write new data into Users.json
 * @param data - contents to update Users.json with
 */
const updateUsersJSON = (data) => {
  const filePath = path.join(__dirname, '../Users.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

/**
 * @description Registers a new user
 * @param req - request of API
 * @param res - response of API
 * @returns - 200 for success, 400 for failure
 */
exports.AddStudent = (req, res) => {
  const { username, studentId } = req.body;

  if (!username || !studentId) {
    return res.status(400).json({ message: 'Username or student ID is required' });
  }

  // Read existing users from Users.json
  const users = readUsersJSON();

  // Check if username already exists in Users.json
  const existsUserName = users.some(user => user.username === username);
  const existsStudentId = users.some(user => user.studentId === studentId);

  if (existsUserName || existsStudentId) {
    return res.status(400).json({ message: 'Username or student ID already exists' });
  }

  // Add new user to the list
  const user = { studentId, username };
  users.push(user);

  // Write updated list back to the file
  updateUsersJSON(users);

  res.status(200).json({ message: 'User added successfully', user: user });
};

/**
 * @description Returns all registered users
 * @param req - request of API
 * @param res - response of API
 */
exports.GetStudents = (req, res) => {
    const users = readUsersJSON();
    res.status(200).json({ message: 'Users retrieved successfully', users });
};