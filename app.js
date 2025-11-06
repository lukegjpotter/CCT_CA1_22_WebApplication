// Module Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); // ToDo: Disable this to allow SQL Injection and XSS.
// App Configuration
const port = 3000;
// Data Storage Todo: Move to database
const pokemonGameReviews = [
  { "game": "Pokémon Red/Blue", "summary": "A classic start to the Pokémon series with engaging gameplay and memorable characters." },
  { "game": "Pokémon Gold/Silver", "summary": "Introduced new features like day/night cycles and breeding, enhancing the overall experience." },
  { "game": "Pokémon Ruby/Sapphire", "summary": "Brought vibrant graphics and the introduction of double battles, making battles more strategic." },
  { "game": "Pokémon Diamond/Pearl", "summary": "Expanded the Pokémon universe with new regions and online capabilities." },
  { "game": "Pokémon Black/White", "summary": "Offered a fresh storyline and a complete Pokédex overhaul, keeping players intrigued." },
  { "game": "Pokémon X/Y", "summary": "Introduced 3D graphics and Mega Evolutions, revolutionizing the visual aspect of the games." },
  { "game": "Pokémon Sun/Moon", "summary": "Brought a new approach to gym battles with trials and a captivating storyline set in the Alola region." },
  { "game": "Pokémon Sword/Shield", "summary": "Featured an open-world area called the Wild Area and introduced Dynamaxing, adding new dynamics to battles." },
  { "game": "Pokemon Legends", "summary": "Arceus: A bold step towards an open-world experience with a focus on exploration and a unique take on Pokémon capturing and battling." },
  { "game": "Pokémon Scarlet/Violet", "summary": "The latest in the series, offering a fully open-world experience with new mechanics and a fresh storyline." },
  { "game": "Pokémon Legends Z-A", "summary": "An upcoming title promising to expand the lore of the Pokémon universe with innovative gameplay features." }
];

// Middleware to serve dynamic content.
app.set('view engine', 'ejs');

// Homepage Route
app.get('/', (req, res) => {
  const searchTerm = req.query.searchTerm || '';
  res.render('index', { searchTerm: searchTerm, searchResults: [], pokemonGameReviews: pokemonGameReviews });
});

app.post('/search', (req, res, next) => {
  // Read searchTerm only from the POST body (form submission).
  const searchTerm = (req.body && req.body.searchTerm) ? req.body.searchTerm : '';
  
  // Log that the term was received from the request body
  console.log(`POST /search received searchTerm: ${searchTerm}`);

  // If no term provided, render home with empty results
  if (!searchTerm) {
    return res.render('index', {
      searchTerm: '',
      searchResults: [],
      pokemonGameReviews: pokemonGameReviews
    });
  }
  // Simple search logic
  const searchResults = pokemonGameReviews.filter(review =>
    review.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render results directly (no redirect).
  res.render('index', {
    searchTerm: searchTerm,
    searchResults: searchResults,
    pokemonGameReviews: pokemonGameReviews
  });
});

// Support GET /search?searchTerm=... so clients can bookmark or use links
app.get('/search', (req, res) => {
  const searchTerm = req.query && req.query.searchTerm ? req.query.searchTerm : '';
  console.log(`GET /search received searchTerm: ${searchTerm}`);

  // If no term provided, render home with empty results
  if (!searchTerm) {
    return res.render('index', {
      searchTerm: '',
      searchResults: [],
      pokemonGameReviews: pokemonGameReviews
    });
  }

  const searchResults = pokemonGameReviews.filter(review =>
    review.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  res.render('index', {
    searchTerm: searchTerm,
    searchResults: searchResults,
    pokemonGameReviews: pokemonGameReviews
  });
});

// Default Route
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// Start Server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});