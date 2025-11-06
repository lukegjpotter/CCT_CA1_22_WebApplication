const db = require('../db/sqlite');
const reviews = require('../data/reviews');

(async () => {
  try {
    await db.init();
    const result = await db.seed(reviews);
    if (result && result.seeded) {
      console.log('Seeded reviews into SQLite DB.');
    } else {
      console.log('Database already seeded or no action taken:', result && result.reason);
    }
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
})();
