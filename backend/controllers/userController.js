const fs = require('fs');
const path = require('path');

// Read Users.json and parse contents
const readUsersJSON = () => {
  const filePath = path.join(__dirname, '../Users.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Write new data into Users.json
const updateUsersJSON = (data) => {
  const filePath = path.join(__dirname, '../Users.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Registers a new user
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

// Returns all registered users
exports.GetStudents = (req, res) => {
    const users = readUsersJSON();
    res.status(200).json({ message: 'Users retrieved successfully', users });
};