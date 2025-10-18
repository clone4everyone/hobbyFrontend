const UserPanel = ({ users, onEdit, onDelete, onLink, onUnlink }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [linkMode, setLinkMode] = useState(null);

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      
      <div className="space-y-3">
        {users.map(user => (
          <div key={user.id} className="border rounded-lg p-3 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold">{user.username}</h3>
                <p className="text-sm text-gray-600">Age: {user.age}</p>
                <p className="text-sm text-gray-600">Score: {user.popularityScore?.toFixed(1) || 0}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(user)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(user)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
              {user.hobbies.slice(0, 3).map(hobby => (
                <span key={hobby} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {hobby}
                </span>
              ))}
              {user.hobbies.length > 3 && (
                <span className="text-xs text-gray-500">+{user.hobbies.length - 3}</span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLinkMode('link');
                  setSelectedUser(user);
                }}
                className="flex-1 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                <Link size={12} className="inline mr-1" />
                Link
              </button>
              {user.friends?.length > 0 && (
                <button
                  onClick={() => {
                    setLinkMode('unlink');
                    setSelectedUser(user);
                  }}
                  className="flex-1 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  <Unlink size={12} className="inline mr-1" />
                  Unlink
                </button>
              )}
            </div>

            {selectedUser?.id === user.id && linkMode && (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-xs font-medium mb-1">
                  {linkMode === 'link' ? 'Select user to link:' : 'Select friend to unlink:'}
                </p>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      if (linkMode === 'link') {
                        onLink(user.id, e.target.value);
                      } else {
                        onUnlink(user.id, e.target.value);
                      }
                      setLinkMode(null);
                      setSelectedUser(null);
                    }
                  }}
                  className="w-full text-xs border rounded p-1"
                >
                  <option value="">Choose...</option>
                  {linkMode === 'link'
                    ? users.filter(u => u.id !== user.id && !user.friends?.includes(u.id)).map(u => (
                        <option key={u.id} value={u.id}>{u.username}</option>
                      ))
                    : users.filter(u => user.friends?.includes(u.id)).map(u => (
                        <option key={u.id} value={u.id}>{u.username}</option>
                      ))
                  }
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};