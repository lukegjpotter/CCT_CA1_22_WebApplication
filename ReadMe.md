# Web App Vulnerable to XSS and SQL Injection

This is a small Express app used for teaching/security demonstration.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Seed the SQLite database (run once):

```bash
npm run seed
```

This creates a `data/reviews.db` file and populates it with the sample `pokemonGameReviews` data from `data/reviews.js`.

3. Start the app:

```bash
npm start
```

4. Open the app in your browser:

http://localhost:3000

Search examples:

- Submit the form on the homepage.
- Or use GET: `http://localhost:3000/search?searchTerm=Gold`
- Or use curl:

```bash
curl -X POST -d "searchTerm=Gold" http://localhost:3000/search
```