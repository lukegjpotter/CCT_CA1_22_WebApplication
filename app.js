const express = require('express');
const messages = require('./messages');
const app = express();
const port = 3000;

app.use(express.static('public'));

// Homepage Route
app.get('/', (req, res) => {
  res.send(messages.home);
});

// Default Route
app.use((req, res) => {
  res.status(404).send(messages.notFound);
});

// Start Server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});