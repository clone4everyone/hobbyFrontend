import React, { useState, useEffect } from 'react';
import { X, Save, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const UserFormModal = ({ isOpen, onClose, user, mode = 'create' }) => {
  const { createUser, updateUser } = useApp();
  const [formData, setFormData] = useState({
    username: '',
    age: '',
    hobbies: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        username: user.username || '',
        age: user.age?.toString() || '',
        hobbies: user.hobbies?.join(', ') || '',
      });
    } else {
      setFormData({ username: '', age: '', hobbies: '' });
    }
    setErrors({});
  }, [user, mode, isOpen]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 2) {
      newErrors.username = 'Username must be at least 2 characters';
    }

    const ageNum = parseInt(formData.age);
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
      newErrors.age = 'Age must be between 1 and 150';
    }

    const hobbiesArray = formData.hobbies.split(',').map(h => h.trim()).filter(h => h);
    if (hobbiesArray.length === 0) {
      newErrors.hobbies = 'At least one hobby is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const hobbiesArray = formData.hobbies.split(',').map(h => h.trim()).filter(h => h);
    const userData = {
      username: formData.username.trim(),
      age: parseInt(formData.age),
      hobbies: hobbiesArray,
    };

    try {
      if (mode === 'edit' && user) {
        await updateUser(user.id, userData);
      } else {
        await createUser(userData);
      }
      onClose();
    } catch (err) {
      // Error handled by context
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {mode === 'edit' ? <Save size={24} /> : <UserPlus size={24} />}
            {mode === 'edit' ? 'Edit User' : 'Create New User'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Age *
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.age ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter age"
              min="1"
              max="150"
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hobbies * (comma-separated)
            </label>
            <input
              type="text"
              value={formData.hobbies}
              onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.hobbies ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Reading, Gaming, Cooking..."
            />
            {errors.hobbies && (
              <p className="text-red-500 text-sm mt-1">{errors.hobbies}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition transform hover:scale-105"
          >
            {mode === 'edit' ? 'Update User' : 'Create User'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;