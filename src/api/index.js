import axios from 'axios';

// --- Axios API Client (NEW) ---
// This creates and exports the 'api' object that your Login component needs.
// It resolves the error "does not provide an export named 'api'".
export const api = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic API request helper for your new backend
async function apiRequest(path, options = {}) {
  const url = `/api/${path}`;
  try {
    const res = await fetch(url, {
      method: options.method || "GET",
      headers: { "Content-Type": "application/json" },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Request failed with status ${res.status}`);
    }
    return res.status === 204 ? null : await res.json();
  } catch (err) {
    console.error(`[App API] Error for ${url}:`, err);
    throw err;
  }
}

// =================================================================
// DATA FORMATTING HELPERS
// =================================================================

const formatAccount = (acc) => ({
    id: acc.id, // Use numerical id
    fields: {
        "Account Name": acc.account_name,
        "Account Description": acc.account_description,
        "Account Type": acc.account_type,
        "Projects": acc.projects || [],
    }
});

const formatProject = (proj) => ({
    id: proj.id, // Use numerical id
    fields: {
        "Project Name": proj.project_name,
        "Project Status": proj.project_status,
        "Start Date": proj.start_date,
        "End Date": proj.end_date,
        "Account": proj.account_id ? [proj.account_id] : [],
        "Account Name (from Account)": proj.account_name ? [proj.account_name] : [],
        "Project Value": proj.project_value,
        "Project Description": proj.project_description,
        "Updates": proj.updates || [],
    }
});

const formatTask = (task) => ({
    id: task.id, // Use numerical id
    fields: {
        "Task Name": task.task_name,
        "Description": task.description,
        "Status": task.status,
        "Due Date": task.due_date,
        "Project": task.project_id ? [task.project_id] : [],
        "Project Name": task.project_name ? [task.project_name] : [],
        "Assigned To": task.assigned_to_id ? [task.assigned_to_id] : [],
        "Assigned To Name": task.assigned_to_name ? [task.assigned_to_name] : [],
        "Updates": task.updates || [],
    }
});

const formatUpdate = (update) => ({
    id: update.id, // Use numerical id
    fields: {
        "Notes": update.notes,
        "Date": update.date,
        "Update Type": update.update_type,
        "Project": update.project_id ? [update.project_id] : [],
        "Task": update.task_id ? [update.task_id] : [],
        "Update Owner Name": update.update_owner_name ? [update.update_owner_name] : [],
        "Project Name": update.project_name,
        "Task Name": update.task_name,
        "Account Name": update.update_account,
    }
});


// =================================================================
// RE-IMPLEMENTED API FUNCTIONS
// =================================================================

// === USER AUTH (Fixed) ===
// Renamed this function back to 'fetchUserBySecretKey' to match the import in Login.jsx
export async function fetchUserBySecretKey(secretKey) {
  try {
    // A single API call to the backend login route
    const response = await api.post('/auth/login', { secretKey });
    const { user, accounts, projects, tasks_assigned_to, tasks_created_by, updates } = response.data;
    
    // Format the data to match the structure your frontend expects
    return {
      id: user.airtable_id, // The user's primary ID on the frontend is their airtable_id
      user_type: user.user_type, // The crucial new field for admin checks
      fields: {
        "User Name": user.user_name,
        "Accounts": accounts.map(a => a.id),
        "Projects": projects.map(p => p.id),
        "Tasks (Assigned To)": tasks_assigned_to.map(t => t.id),
        "Tasks (Created By)": tasks_created_by.map(t => t.id),
        "Updates": updates.map(u => u.id),
      }
    };
  } catch (err) {
    console.error("Authentication error in api/index.js:", err);
    throw err; // Re-throw to be handled by the Login component
  }
};

export async function fetchAllUsers() {
    const users = await apiRequest("users");
    // The component expects an `id` field which is the airtable_id for users
    return users.map(u => ({ id: u.airtable_id, fields: { "User Name": u.user_name } }));
}

// === GENERIC CUD HELPERS ===

export async function createRecord(table, fields) {
  const endpoint = table.toLowerCase();
  const result = await apiRequest(endpoint, { method: 'POST', body: fields });
  return { id: result.id, fields: result }; // Returns numerical ID for new records
}

export async function updateRecord(table, id, fields) {
  const endpoint = `${table.toLowerCase()}/${id}`;
  return await apiRequest(endpoint, { method: 'PATCH', body: fields });
}

// === BULK FETCHING BY ARRAY OF IDs ===

export async function fetchAccountsByIds(ids = []) {
  if (!ids || ids.length === 0) return [];
  const accounts = await apiRequest(`accounts?ids=${ids.join(',')}`);
  return accounts.map(formatAccount);
}

export async function fetchProjectsByIds(ids = []) {
  if (!ids || ids.length === 0) return [];
  const projects = await apiRequest(`projects?ids=${ids.join(',')}`);
  return projects.map(formatProject);
}

export async function fetchTasksByIds(ids = []) {
  if (!ids || ids.length === 0) return [];
  const tasks = await apiRequest(`tasks?ids=${ids.join(',')}`);
  return tasks.map(formatTask);
}

export async function fetchUpdatesByIds(ids = []) {
    if (!ids || ids.length === 0) return [];
    const updates = await apiRequest(`updates?ids=${ids.join(',')}`);
    return updates.map(formatUpdate);
}

export async function fetchUpdatesByProjectId(projectId) {
    if (!projectId) return [];
    const updates = await apiRequest(`updates/by-project/${projectId}`);
    return updates.map(formatUpdate);
}

// === SINGULAR FETCHES ===
export const fetchAccountById = async (id) => (await fetchAccountsByIds([id]))[0] || null;
export const fetchProjectById = async (id) => (await fetchProjectsByIds([id]))[0] || null;
export const fetchUpdateById = async (id) => (await fetchUpdatesByIds([id]))[0] || null;
export const fetchTaskById = async (id) => (await fetchTasksByIds([id]))[0] || null;

// === CREATION FUNCTIONS ===
export const createAccount = (fields) => createRecord("Accounts", fields);
export const createProject = (fields) => createRecord("Projects", fields);
export const createTask = (fields) => createRecord("Tasks", fields);
export const createUpdate = (fields) => createRecord("Updates", fields);

// === UPDATE FUNCTIONS ===
export const updateUser = (userId, fields) => updateRecord("Users", userId, fields);
export const updateTask = (taskId, fields) => updateRecord("Tasks", taskId, fields);

// =================================================================
// ADMIN API FUNCTIONS (NEW)
// =================================================================

export async function fetchAllProjectsForAdmin() {
  const projects = await apiRequest("admin/projects");
  return projects.map(formatProject);
}

export async function fetchAllTasksForAdmin() {
  const tasks = await apiRequest("admin/tasks");
  return tasks.map(formatTask);
}

export async function fetchAllUsersForAdmin() {
    const users = await apiRequest("admin/users");
    return users.map(user => ({
        id: user.airtable_id,
        fields: {
            "User Name": user.user_name,
            "Email": user.email,
            "User Type": user.user_type,
            "Secret Key": user.airtable_id,
        }
    }));
}


// === CLIENT-SIDE LOGIC (Kept for compatibility) ===

export function formatDateForAirtable(dateInput) {
  if (!dateInput) return "";
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function fetchAllUpdates() {
    const updates = await apiRequest("updates");
    return updates.map(formatUpdate);
}

export function processUpdatesByProject(allUpdates, projectIds = []) {
  if (!projectIds || projectIds.length === 0) return {};
  const updatesByProjectId = {};
  projectIds.forEach(pid => { updatesByProjectId[pid] = []; });
  allUpdates.forEach(update => {
    const updateProjectIds = update.fields.Project || [];
    updateProjectIds.forEach(projectId => {
      const matchingId = projectIds.find(p => p === projectId);
      if (matchingId && updatesByProjectId[matchingId]) {
        updatesByProjectId[matchingId].push(update);
      }
    });
  });
  return updatesByProjectId;
}
