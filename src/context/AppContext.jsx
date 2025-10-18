import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiService } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (userData) => {
    setLoading(true);
    try {
      await apiService.createUser(userData);
      await fetchUsers();
      setSuccess('User created successfully!');
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    try {
      await apiService.updateUser(id, userData);
      await fetchUsers();
      setSuccess('User updated successfully!');
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await apiService.deleteUser(id);
      await fetchUsers();
      setSuccess('User deleted successfully!');
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const linkUsers = async (userId, friendId) => {
    setLoading(true);
    try {
      await apiService.linkUsers(userId, friendId);
      await fetchUsers();
      setSuccess('Users linked successfully!');
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unlinkUsers = async (userId, friendId) => {
    setLoading(true);
    try {
      await apiService.unlinkUsers(userId, friendId);
      await fetchUsers();
      setSuccess('Users unlinked successfully!');
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    users,
    loading,
    error,
    success,
    setError,
    setSuccess,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    linkUsers,
    unlinkUsers,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};