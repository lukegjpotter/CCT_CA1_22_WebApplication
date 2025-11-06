// Module Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); // ToDo: Disable this to allow SQL Injection and XSS.
// Local Imports
const messages = require('./messages');
// Settings
const port = 3000;

app.use(express.static('public'));

// Homepage Route
app.get('/', (req, res) => {
  res.send(messages.home);
});

app.post('/submit', (req, res) => {
  const searchTerm = req.body.searchTerm;
  console.log(`Search Term Received: ${searchTerm}`);
  res.send(`You searched for: ${searchTerm}`);
});

// Default Route
app.use((req, res) => {
  res.status(404).send(messages.notFound);
});

// Start Server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});