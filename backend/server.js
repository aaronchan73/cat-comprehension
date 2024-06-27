const express = require('express');
const routes = require('./routes');

// Initialize express app
const app = express();

// Routes
app.use('/api', routes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});