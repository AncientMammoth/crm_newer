const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to check for admin user
const isAdmin = (req, res, next) => {
  // Assuming you have user information in req.user after authentication
  if (req.user && req.user.user_type === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
};

router.use(isAdmin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, username, email, user_type FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all projects
router.get('/projects', async (req, res) => {
    try {
      const { rows } = await db.query('SELECT * FROM projects');
      res.json(rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
      const { rows } = await db.query('SELECT * FROM tasks');
      res.json(rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

// Create a new task
router.post('/tasks', async (req, res) => {
  const { title, description, assigned_to } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO tasks (title, description, assigned_to) VALUES ($1, $2, $3) RETURNING *',
      [title, description, assigned_to]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;