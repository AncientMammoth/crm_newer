const express = require('express');
const router = express.Router();
const db = require('../db'); // Your configured Postgres connection

/**
 * @route   POST /api/auth/verify
 * @desc    Verify user type from PostgreSQL database using the secret key.
 * @access  Public
 */
router.post('/verify', async (req, res) => {
  const { secretKey } = req.body;

  if (!secretKey) {
    return res.status(400).json({ message: 'Secret key is required for verification.' });
  }

  try {
    // Query the 'users' table using the secret key, which is the 'airtable_id'.
    const query = 'SELECT user_type FROM users WHERE airtable_id = $1';
    const { rows } = await db.query(query, [secretKey]);

    // If no user is found in your database with that key
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found in database.' });
    }

    // User was found, return their role
    const user_type = rows[0].user_type;
    res.json({ user_type });

  } catch (err) {
    console.error('Database verification error:', err.message);
    res.status(500).send('Server error during user verification.');
  }
});

module.exports = router;
