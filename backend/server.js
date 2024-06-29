const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

// Initialize express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});