const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const jwt = require("jsonwebtoken");

// It's crucial to use a strong, secret key stored as an environment variable
const JWT_SECRET = process.env.JWT_SECRET || "your-default-super-secret-key";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- UTILITY FUNCTION FOR SENDING ERRORS ---
const sendError = (res, message, err) => {
  console.error(message, err);
  res.status(500).json({ error: message });
};

// =================================================================
// AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// =================================================================

// Middleware to verify JWT and attach user info to the request
const authorize = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expects "Bearer TOKEN"
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Adds { userId, role } to the request object
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token." });
  }
};

// Middleware to ensure the user has an 'admin' role
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden. Admin access required." });
  }
  next();
};

// =================================================================
// LOGIN ENDPOINT
// =================================================================

app.post("/api/login", async (req, res) => {
  try {
    const { secretKey } = req.body;
    if (!secretKey) {
      return res.status(400).json({ error: "Secret key is required." });
    }

    // This single query fetches all necessary data for both user types
    const { rows } = await db.query(
      `SELECT
        u.id, u.airtable_id, u.user_name, u.user_type,
        COALESCE(json_agg(DISTINCT a.id) FILTER (WHERE a.id IS NOT NULL), '[]') AS accounts,
        COALESCE(json_agg(DISTINCT p.id) FILTER (WHERE p.id IS NOT NULL), '[]') AS projects,
        COALESCE(json_agg(DISTINCT t_assigned.id) FILTER (WHERE t_assigned.id IS NOT NULL), '[]') AS tasks_assigned_to,
        COALESCE(json_agg(DISTINCT t_created.id) FILTER (WHERE t_created.id IS NOT NULL), '[]') AS tasks_created_by,
        COALESCE(json_agg(DISTINCT upd.id) FILTER (WHERE upd.id IS NOT NULL), '[]') AS updates
      FROM users u
      LEFT JOIN accounts a ON a.account_owner_id = u.id
      LEFT JOIN projects p ON p.project_owner_id = u.id
      LEFT JOIN tasks t_assigned ON t_assigned.assigned_to_id = u.id
      LEFT JOIN tasks t_created ON t_created.created_by_id = u.id
      LEFT JOIN updates upd ON upd.update_owner_id = u.id
      WHERE u.airtable_id = $1
      GROUP BY u.id, u.airtable_id, u.user_name, u.user_type`,
      [secretKey]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Invalid secret key." });
    }

    const user = rows[0];
    const token = jwt.sign(
      { userId: user.id, role: user.user_type },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    // The response now includes a 'user' object with all the data the frontend needs
    res.json({
      token,
      user: {
        id: user.airtable_id,
        userName: user.user_name,
        role: user.user_type,
        accounts: user.accounts,
        projects: user.projects,
        updates: user.updates,
        tasksAssignedTo: user.tasks_assigned_to,
        tasksCreatedBy: user.tasks_created_by,
      },
    });
  } catch (err) {
    sendError(res, "Login failed.", err);
  }
});


// =================================================================
// ADMIN-SPECIFIC ENDPOINTS
// =================================================================

app.get("/api/admin/dashboard-data", authorize, adminOnly, async (req, res) => {
  try {
    const usersQuery = "SELECT id, user_name, email, user_type FROM users ORDER BY user_name";
    const projectsQuery = `
        SELECT p.*, a.account_name, u.user_name as project_owner_name
        FROM projects p
        JOIN accounts a ON p.account_id = a.id
        JOIN users u ON p.project_owner_id = u.id
    `;
    const updatesQuery = "SELECT * FROM updates ORDER BY date DESC";

    const [usersResult, projectsResult, updatesResult] = await Promise.all([
        db.query(usersQuery),
        db.query(projectsQuery),
        db.query(updatesQuery)
    ]);

    res.json({
        users: usersResult.rows,
        projects: projectsResult.rows,
        updates: updatesResult.rows,
    });

  } catch (err) {
    sendError(res, "Failed to fetch admin dashboard data.", err);
  }
});

app.post("/api/admin/assign-task", authorize, adminOnly, async (req, res) => {
    const created_by_id = req.user.userId;
    const { "Task Name": name, "Project": project_id, "Assigned To": assigned_to_id, "Due Date": due_date, "Status": status, "Description": description } = req.body;
    try {
        if (!name || !project_id || !assigned_to_id || !status) {
            return res.status(400).json({ error: "Missing required task fields." });
        }
        const { rows } = await db.query(
            `INSERT INTO tasks (task_name, project_id, assigned_to_id, due_date, status, description, created_by_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, Array.isArray(project_id) ? project_id[0] : project_id, assigned_to_id, due_date, status, description, created_by_id]
        );
        res.status(201).json(rows[0]);
    } catch (err) { 
        sendError(res, 'Failed to create task.', err); 
    }
});


// =================================================================
// ORIGINAL ENDPOINTS FOR REGULAR USERS (Unchanged)
// =================================================================
// Note: These endpoints are still needed for the regular user dashboard to function.

app.get("/api/users", async (req, res) => {
    try {
        const { rows } = await db.query("SELECT id, airtable_id, user_name FROM users ORDER BY user_name;");
        res.json(rows);
    } catch (err) {
        sendError(res, "Failed to fetch all users.", err);
    }
});

app.get("/api/accounts", async (req, res) => {
    try {
        const { ids } = req.query;
        if (!ids) return res.status(400).json({ error: "No IDs provided." });
        const idArray = ids.split(',').map(Number);

        const { rows } = await db.query(
            `SELECT a.*, COALESCE(p.projects, '[]') as projects
             FROM accounts a
             LEFT JOIN (
                SELECT account_id, json_agg(p.id) as projects FROM projects p GROUP BY account_id
             ) p ON p.account_id = a.id
             WHERE a.id = ANY($1::integer[])`,
            [idArray]
        );
        res.json(rows);
    } catch (err) {
        sendError(res, 'Failed to fetch accounts', err);
    }
});

app.get("/api/projects", async (req, res) => {
    try {
        const { ids } = req.query;
        if (!ids) return res.status(400).json({ error: "No IDs provided." });
        const idArray = ids.split(',').map(Number);
        
        const { rows } = await db.query(
            `SELECT p.*, a.account_name, COALESCE(upd.updates, '[]'::json) as updates
             FROM projects p
             LEFT JOIN accounts a ON p.account_id = a.id
             LEFT JOIN (
                SELECT project_id, json_agg(upd.id ORDER BY date DESC, created_at DESC) as updates
                FROM updates upd GROUP BY project_id
             ) upd ON upd.project_id = p.id
             WHERE p.id = ANY($1::integer[])`,
            [idArray]
        );
        res.json(rows);
    } catch (err) {
        sendError(res, 'Failed to fetch projects', err);
    }
});

app.get("/api/tasks", async (req, res) => {
    try {
        const { ids } = req.query;
        if (!ids) return res.status(400).json({ error: "No IDs provided." });
        const idArray = ids.split(',').map(Number);

        const { rows } = await db.query(
            `SELECT t.*, p.project_name, p.id as project_id, u.user_name as assigned_to_name, COALESCE(upd.updates, '[]'::json) as updates
             FROM tasks t
             LEFT JOIN projects p ON t.project_id = p.id
             LEFT JOIN users u ON t.assigned_to_id = u.id
             LEFT JOIN (
                SELECT task_id, json_agg(json_build_object('id', up.id, 'notes', up.notes, 'date', up.date, 'update_type', up.update_type, 'update_owner_name', owner.user_name)) as updates
                FROM updates up
                LEFT JOIN users owner ON up.update_owner_id = owner.id
                GROUP BY task_id
             ) upd ON upd.task_id = t.id
             WHERE t.id = ANY($1::integer[])`,
            [idArray]
        );
        res.json(rows);
    } catch (err) {
        sendError(res, 'Failed to fetch tasks', err);
    }
});

app.get("/api/updates", async (req, res) => {
    try {
        const { ids } = req.query;
        let query = `
            SELECT u.*, owner.user_name as update_owner_name, p.project_name, p.id as project_id, t.task_name, t.id as task_id, a.account_name as update_account
            FROM updates u
            LEFT JOIN users owner ON u.update_owner_id = owner.id
            LEFT JOIN projects p ON u.project_id = p.id
            LEFT JOIN tasks t ON u.task_id = t.id
            LEFT JOIN accounts a ON p.account_id = a.id
        `;
        const queryParams = [];

        if (ids) {
            query += ` WHERE u.id = ANY($1::integer[])`;
            queryParams.push(ids.split(',').map(Number));
        }

        query += ` ORDER BY u.date DESC, u.created_at DESC`;

        const { rows } = await db.query(query, queryParams);
        res.json(rows);
    } catch (err) {
        sendError(res, 'Failed to fetch updates', err);
    }
});

// --- ALL ORIGINAL CREATE/UPDATE/PATCH ENDPOINTS ---
app.post("/api/accounts", async (req, res) => {
    const { "Account Name": account_name, "Account Type": account_type, "Account Description": account_description, "Account Owner": owner_airtable_id_arr } = req.body;
    try {
        const ownerRes = await db.query("SELECT id FROM users WHERE airtable_id = $1", [owner_airtable_id_arr[0]]);
        const owner_id = ownerRes.rows[0]?.id;
        if (!owner_id) return res.status(400).json({ error: "Invalid account owner ID" });
        
        const { rows } = await db.query(
            `INSERT INTO accounts (account_name, account_type, account_description, account_owner_id) VALUES ($1, $2, $3, $4) RETURNING *`,
            [account_name, account_type, account_description, owner_id]
        );
        res.status(201).json(rows[0]);
    } catch (err) { sendError(res, 'Failed to create account.', err); }
});

app.post("/api/projects", async (req, res) => {
    const { "Project Name": name, "Project Status": status, "Start Date": start_date, "End Date": end_date, "Account": account_id_arr, "Project Value": value, "Project Description": description, "Project Owner": owner_airtable_id_arr } = req.body;
    try {
        const account_id = account_id_arr[0];
        const ownerRes = await db.query("SELECT id FROM users WHERE airtable_id = $1", [owner_airtable_id_arr[0]]);
        const owner_id = ownerRes.rows[0]?.id;
        if (!account_id || !owner_id) return res.status(400).json({ error: "Invalid account or owner ID" });

        const { rows } = await db.query(
            `INSERT INTO projects (project_name, project_status, start_date, end_date, account_id, project_value, project_description, project_owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [name, status, start_date, end_date, account_id, value || null, description, owner_id]
        );
        res.status(201).json(rows[0]);
    } catch (err) { sendError(res, 'Failed to create project.', err); }
});

app.post("/api/tasks", async (req, res) => {
    const { "Task Name": name, "Project": project_id, "Assigned To": assigned_to_airtable_id, "Due Date": due_date, "Status": status, "Description": description, "Created By": created_by_airtable_id } = req.body;
    try {
        const assignedToRes = await db.query("SELECT id FROM users WHERE airtable_id = $1", [assigned_to_airtable_id]);
        const createdByRes = await db.query("SELECT id FROM users WHERE airtable_id = $1", [created_by_airtable_id]);
        const assigned_to_id = assignedToRes.rows[0]?.id;
        const created_by_id = createdByRes.rows[0]?.id;
        if (!project_id || !assigned_to_id || !created_by_id) {
            return res.status(400).json({ error: "Invalid project, assigned to, or created by ID" });
        }
        const { rows } = await db.query(
            `INSERT INTO tasks (task_name, project_id, assigned_to_id, due_date, status, description, created_by_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, project_id, assigned_to_id, due_date, status, description, created_by_id]
        );
        res.status(201).json(rows[0]);
    } catch (err) { 
        sendError(res, 'Failed to create task.', err); 
    }
});

app.post("/api/updates", async (req, res) => {
    const { "Notes": notes, "Date": date, "Update Type": update_type, "Project": project_id, "Task": task_id, "Update Owner": owner_airtable_id } = req.body;
    try {
        const ownerRes = await db.query("SELECT id, user_name FROM users WHERE airtable_id = $1", [owner_airtable_id]);
        const owner_id = ownerRes.rows[0]?.id;
        const update_owner_name = ownerRes.rows[0]?.user_name;
        const projectInfoRes = await db.query(
            `SELECT p.project_name, a.account_name FROM projects p JOIN accounts a ON p.account_id = a.id WHERE p.id = $1`,
            [project_id]
        );
        const project_name = projectInfoRes.rows[0]?.project_name;
        const update_account = projectInfoRes.rows[0]?.account_name;
        if (!project_id || !owner_id || !project_name || !update_owner_name || !update_account) {
            return res.status(400).json({ error: "Invalid IDs, or associated names/account could not be found." });
        }
        const { rows } = await db.query(
            `INSERT INTO updates (notes, date, update_type, project_id, task_id, update_owner_id, project_name, update_owner_name, update_account) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [notes, date, update_type, project_id, task_id || null, owner_id, project_name, update_owner_name, update_account]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        sendError(res, 'Failed to create update.', err);
    }
});

app.patch("/api/projects/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const fields = req.body;
        if (Object.keys(fields).length === 0) {
            return res.status(400).json({ error: "No fields provided to update." });
        }
        const setClauses = Object.keys(fields).map((key, index) => {
            const dbColumn = key.replace(/\s+/g, '_').toLowerCase();
            return `"${dbColumn}" = $${index + 1}`;
        }).join(", ");
        const values = Object.values(fields);
        const { rows } = await db.query(
            `UPDATE projects SET ${setClauses} WHERE id = $${values.length + 1} RETURNING *`,
            [...values, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "Project not found or no update was made." });
        }
        res.json(rows[0]);
    } catch (err) {
        sendError(res, "Failed to update project.", err);
    }
});

app.patch("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const fields = req.body;
        const fieldToUpdate = Object.keys(fields)[0];
        const value = fields[fieldToUpdate];
        const dbColumn = fieldToUpdate.toLowerCase();
        const { rows } = await db.query(
            `UPDATE tasks SET ${dbColumn} = $1 WHERE id = $2 RETURNING *`,
            [value, id]
        );
        res.json(rows[0]);
    } catch (err) { sendError(res, "Failed to update task.", err); }
});

module.exports = app;
