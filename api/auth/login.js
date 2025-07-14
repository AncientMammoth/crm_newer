const db = require('../db'); // Adjust path if your db connection file is elsewhere

module.exports = async (req, res) => {
  // Ensure this is a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { secretKey } = req.body;

  if (!secretKey) {
    return res.status(400).json({ error: 'Secret key is required.' });
  }

  try {
    // 1. Fetch the user by their secret key (airtable_id)
    const userQuery = 'SELECT * FROM users WHERE airtable_id = $1';
    const userResult = await db.query(userQuery, [secretKey]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const user = userResult.rows[0];

    // 2. Fetch all associated data for that user
    const accountsQuery = 'SELECT id FROM accounts WHERE user_id = $1';
    const projectsQuery = 'SELECT id FROM projects WHERE user_id = $1';
    const tasksAssignedQuery = 'SELECT id FROM tasks WHERE assigned_to_id = $1';
    const tasksCreatedQuery = 'SELECT id FROM tasks WHERE created_by_id = $1';
    const updatesQuery = 'SELECT id FROM updates WHERE user_id = $1';

    const [
      accountsResult,
      projectsResult,
      tasksAssignedResult,
      tasksCreatedResult,
      updatesResult
    ] = await Promise.all([
      db.query(accountsQuery, [user.id]),
      db.query(projectsQuery, [user.id]),
      db.query(tasksAssignedQuery, [user.id]),
      db.query(tasksCreatedQuery, [user.id]),
      db.query(updatesQuery, [user.id])
    ]);

    // 3. Send the complete payload back to the frontend
    res.status(200).json({
      user: {
        airtable_id: user.airtable_id,
        user_name: user.user_name,
        user_type: user.user_type,
      },
      accounts: accountsResult.rows,
      projects: projectsResult.rows,
      tasks_assigned_to: tasksAssignedResult.rows,
      tasks_created_by: tasksCreatedResult.rows,
      updates: updatesResult.rows,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
