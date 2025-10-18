import React, { useState, useMemo } from 'react';
import { Users, Plus, Search, Edit, Trash2, Award } from 'lucide-react';

const Sidebar = ({ users, onCreateUser, onEditUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  const allHobbies = useMemo(() => {
    return [...new Set(users.flatMap(u => u.hobbies))].sort();
  }, [users]);

  const filteredHobbies = useMemo(() => {
    return allHobbies.filter(h =>
      h.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allHobbies, searchTerm]);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => 
      (b.popularityScore || 0) - (a.popularityScore || 0)
    );
  }, [users]);

  return (
    <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Users className="text-blue-600" size={28} />
          User Network
        </h2>
        <button
          onClick={onCreateUser}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-md"
        >
          <Plus size={20} />
          Create New User
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hobbies Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Search size={16} />
              Search Hobbies
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to filter..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filteredHobbies.length > 0 ? (
              filteredHobbies.map(hobby => (
                <span
                  key={hobby}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium cursor-default hover:bg-blue-200 transition"
                >
                  {hobby}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No hobbies found</p>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="p-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center justify-between">
            <span>All Users ({users.length})</span>
            <Award className="text-yellow-500" size={18} />
          </h3>

          <div className="space-y-3">
            {sortedUsers.map((user, index) => (
              <div
                key={user.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition transform hover:scale-102 ${
                  selectedUserId === user.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white'
                }`}
                onClick={() => setSelectedUserId(user.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {index < 3 && (
                        <span className="text-yellow-500">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                      <h4 className="font-bold text-gray-800">{user.username}</h4>
                    </div>
                    <p className="text-sm text-gray-600">Age: {user.age}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        Score: {(user.popularityScore || 0).toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.friends?.length || 0} friends
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditUser(user);
                      }}
                      className="p-2 hover:bg-blue-100 rounded-lg transition"
                      title="Edit user"
                    >
                      <Edit size={16} className="text-blue-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteUser(user);
                      }}
                      className="p-2 hover:bg-red-100 rounded-lg transition"
                      title="Delete user"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {user.hobbies.slice(0, 3).map((hobby, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {hobby}
                    </span>
                  ))}
                  {user.hobbies.length > 3 && (
                    <span className="px-2 py-0.5 text-gray-500 text-xs">
                      +{user.hobbies.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users size={48} className="mx-auto mb-2 opacity-50" />
                <p>No users yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;