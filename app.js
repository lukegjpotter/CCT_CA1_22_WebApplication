// Module Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); // ToDo: Disable this to allow SQL Injection and XSS.
// App Configuration
const port = 3000;
// Persist reviews in SQLite.
const db = require('./db/sqlite');
const searchHelper = require('./lib/search');

// Middleware to serve dynamic content.
app.set('view engine', 'ejs');

// Homepage Route
app.get('/', async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm || '';
    const { reviews, searchResults } = await searchHelper.performSearch(searchTerm);
    res.render('index', { searchTerm: searchTerm, searchResults: searchResults, pokemonGameReviews: reviews });
  } catch (err) {
    next(err);
  }
});

app.post('/search', async (req, res, next) => {
  // Read searchTerm only from the POST body (form submission).
  const searchTerm = (req.body && req.body.searchTerm) ? req.body.searchTerm : '';
  
  // Log that the term was received from the request body
  console.log(`POST /search received searchTerm: ${searchTerm}`);

  try {
    // If no term provided, render home with empty results
    if (!searchTerm) {
      const reviews = await db.allReviews();
      return res.render('index', {
        searchTerm: '',
        searchResults: [],
        pokemonGameReviews: reviews
      });
    }

    const { reviews, searchResults } = await searchHelper.performSearch(searchTerm);
    res.render('index', {
      searchTerm: searchTerm,
      searchResults: searchResults,
      pokemonGameReviews: reviews
    });
  } catch (err) {
    next(err);
  }
});

// Support GET /search?searchTerm=... so clients can bookmark or use links
app.get('/search', async (req, res, next) => {
  try {
    const searchTerm = req.query && req.query.searchTerm ? req.query.searchTerm : '';
    console.log(`GET /search received searchTerm: ${searchTerm}`);

    // If no term provided, render home with empty results
    if (!searchTerm) {
      const reviews = await db.allReviews();
      return res.render('index', {
        searchTerm: '',
        searchResults: [],
        pokemonGameReviews: reviews
      });
    }

    const { reviews, searchResults } = await searchHelper.performSearch(searchTerm);
    res.render('index', {
      searchTerm: searchTerm,
      searchResults: searchResults,
      pokemonGameReviews: reviews
    });
  } catch (err) {
    next(err);
  }
});

// Default Route
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// Start Server after DB init
(async () => {
  try {
    await db.init();
    console.log('Database initialized.');
    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
})();

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});