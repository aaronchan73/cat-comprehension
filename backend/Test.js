// test-runner.js
const { exec } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

// Run tests
exec('npx mocha --reporter spec > test-results.txt', (err, stdout, stderr) => {
  if (err) {
    console.log(err)
    console.error(`Error running tests: ${stderr}`);
    return;
  }
  console.log('Tests completed. Opening index.html...');

  // Start a simple server to serve index.html
  const server = http.createServer((req, res) => {
    if (req.url === '/') {
      fs.readFile(path.join(__dirname, 'index.html'), 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading index.html');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
    } else if (req.url === '/test-results.html') {
      fs.readFile(path.join(__dirname, 'test-results.html'), 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading test results');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
    }
  });

  // Start the server
  server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
    console.log('Open your browser to see the test results.');
  });
});
