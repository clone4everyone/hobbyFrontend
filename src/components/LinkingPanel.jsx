import React from 'react';
import { Link2, XCircle } from 'lucide-react';

const LinkingPanel = ({ isLinking, linkSourceUser, onToggle, onCancel }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-blue-500">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Link2 className="text-blue-600" size={20} />
          Link Users
        </h3>
        {isLinking && (
          <button
            onClick={onCancel}
            className="text-red-500 hover:text-red-700 transition"
          >
            <XCircle size={20} />
          </button>
        )}
      </div>

      {!isLinking ? (
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Click to start linking users together
          </p>
          <button
            onClick={onToggle}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            Start Linking
          </button>
        </div>
      ) : (
        <div>
          {!linkSourceUser ? (
            <p className="text-sm text-blue-600 font-medium">
              Step 1: Click on the first user node
            </p>
          ) : (
            <div>
              <p className="text-sm text-green-600 font-medium mb-2">
                Selected: <strong>{linkSourceUser.username}</strong>
              </p>
              <p className="text-sm text-blue-600 font-medium">
                Step 2: Click on the second user to link
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkingPanel;