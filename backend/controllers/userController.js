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
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  // Read existing users from Users.json
  const users = readUsersJSON();

  // Check if username already exists in Users.json
  const exists = users.some(user => user.username === username);
  if (exists) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Add new user to the list
  const user = { username };
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