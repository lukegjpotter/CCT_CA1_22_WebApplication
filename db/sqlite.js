const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbFile = path.join(dataDir, 'reviews.db');
const db = new sqlite3.Database(dbFile);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
  });
}

async function init() {
  await run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game TEXT NOT NULL,
      summary TEXT
    )
  `);
}

async function seed(reviews) {
  // Insert reviews if table is empty
  const row = await get('SELECT COUNT(*) as count FROM reviews');
  if (row && row.count > 0) return { seeded: false, reason: 'already seeded' };

  const stmt = db.prepare('INSERT INTO reviews (game, summary) VALUES (?, ?)');
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      for (const r of reviews) {
        stmt.run(r.game, r.summary);
      }
      stmt.finalize(err => err ? reject(err) : resolve({ seeded: true }));
    });
  });
}

async function allReviews() {
  return all('SELECT * FROM reviews ORDER BY id');
}

async function searchReviews(term) {
  const like = `%${term.toLowerCase()}%`;
  return all('SELECT * FROM reviews WHERE LOWER(game) LIKE ? ORDER BY id', [like]);
}

module.exports = { db, init, seed, allReviews, searchReviews };
