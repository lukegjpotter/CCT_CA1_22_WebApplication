const db = require('../db/sqlite');

// Returns { reviews, searchResults }
async function performSearch(term) {
  const reviews = await db.allReviews();
  const normalized = (term || '').toString().trim();
  if (!normalized) return { reviews, searchResults: [] };
  const searchResults = await db.searchReviews(normalized);
  return { reviews, searchResults };
}

module.exports = { performSearch };
