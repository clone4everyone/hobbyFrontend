// Your backend runs on http://localhost:5000
// These are the EXACT endpoints from your server.js

const API_BASE = 'https://hobbymanagement.onrender.com/api';

export const apiService = {
  // GET /api/users - Fetch all users
  async getUsers() {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  // POST /api/users - Create a new user
  async createUser(userData) {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create user');
    return data;
  },

  // PUT /api/users/:id - Update a user
  async updateUser(id, userData) {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update user');
    return data;
  },

  // DELETE /api/users/:id - Delete a user (only if not linked)
  async deleteUser(id) {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete user');
    return data;
  },

  // POST /api/users/:id/link - Create friendship between two users
  async linkUsers(userId, friendId) {
    const response = await fetch(`${API_BASE}/users/${userId}/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to link users');
    return data;
  },

  // DELETE /api/users/:id/unlink - Remove friendship
  async unlinkUsers(userId, friendId) {
    const response = await fetch(`${API_BASE}/users/${userId}/unlink`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to unlink users');
    return data;
  },

  // GET /api/graph - Return graph data of users and relationships
  async getGraphData() {
    const response = await fetch(`${API_BASE}/graph`);
    if (!response.ok) throw new Error('Failed to fetch graph data');
    return response.json();
  },

  // GET /api/health - Health check (optional)
  async healthCheck() {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  },
};