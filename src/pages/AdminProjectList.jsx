import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/layout/AdminNavbar';
import { api } from '../api';

const AdminProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/admin/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Projects</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <ul>
            {projects.map((project) => (
              <li key={project.id} className="border-b py-2">
                <p className="font-bold">{project.name}</p>
                <p>Description: {project.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectList;