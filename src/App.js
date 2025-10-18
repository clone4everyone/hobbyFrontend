import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useApp } from './context/AppContext';
import CustomNode from './components/CustomNode';
import Sidebar from './components/Sidebar';
import UserFormModal from './components/UserFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import LinkingPanel from './components/LinkingPanel';
import Toast from './components/Toast';

const nodeTypes = {
  custom: CustomNode,
};

const App = () => {
  const { 
    users, 
    loading, 
    error, 
    success, 
    setError, 
    setSuccess, 
    fetchUsers, 
    deleteUser, 
    linkUsers 
  } = useApp();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const [showUserForm, setShowUserForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [linkMode, setLinkMode] = useState(false);
  const [linkSourceId, setLinkSourceId] = useState(null);
  const [linkSourceUser, setLinkSourceUser] = useState(null);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Update graph when users change
  useEffect(() => {
    if (users.length > 0) {
      // Create nodes with better positioning
      const newNodes = users.map((user, idx) => {
        const col = idx % 5;
        const row = Math.floor(idx / 5);
        
        return {
          id: user.id,
          type: 'custom',
          position: {
            x: col * 250 + 50,
            y: row * 250 + 50,
          },
          data: {
            label: user.username,
            age: user.age,
            hobbies: user.hobbies,
            popularityScore: user.popularityScore || 0,
          },
        };
      });

      // Create edges (prevent duplicates)
      const newEdges = [];
      const processedPairs = new Set();

      users.forEach(user => {
        user.friends?.forEach(friendId => {
          const pairKey = [user.id, friendId].sort().join('-');
          if (!processedPairs.has(pairKey)) {
            processedPairs.add(pairKey);
            newEdges.push({
              id: `${user.id}-${friendId}`,
              source: user.id,
              target: friendId,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#3b82f6', strokeWidth: 2 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#3b82f6',
              },
            });
          }
        });
      });

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [users, setNodes, setEdges]);

  // Handle node click for linking
  const handleNodeClick = useCallback((event, node) => {
    if (linkMode) {
      if (!linkSourceId) {
        // First click - select source
        setLinkSourceId(node.id);
        const user = users.find(u => u.id === node.id);
        setLinkSourceUser(user);
      } else if (linkSourceId !== node.id) {
        // Second click - create link
        linkUsers(linkSourceId, node.id);
        setLinkSourceId(null);
        setLinkSourceUser(null);
        setLinkMode(false);
      }
    }
  }, [linkMode, linkSourceId, users, linkUsers]);

  // Handle connection (drag from one node to another)
  const onConnect = useCallback((params) => {
    if (params.source !== params.target) {
      linkUsers(params.source, params.target);
    }
  }, [linkUsers]);

  // Modal handlers
  const handleCreateUser = () => {
    setFormMode('create');
    setSelectedUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user) => {
    setFormMode('edit');
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(selectedUser.id);
      setShowDeleteConfirm(false);
      setSelectedUser(null);
    } catch (err) {
      setShowDeleteConfirm(false);
    }
  };

  const toggleLinkMode = () => {
    setLinkMode(!linkMode);
    setLinkSourceId(null);
    setLinkSourceUser(null);
  };

  const cancelLinking = () => {
    setLinkMode(false);
    setLinkSourceId(null);
    setLinkSourceUser(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        users={users}
        onCreateUser={handleCreateUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      {/* Main Content - React Flow */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700 font-semibold">Loading...</p>
            </div>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
          defaultEdgeOptions={{
            animated: true,
          }}
        >
          <Controls className="bg-white shadow-lg rounded-lg" />
          <MiniMap 
            className="bg-white shadow-lg rounded-lg" 
            nodeColor={(node) => {
              const score = node.data.popularityScore || 0;
              const intensity = Math.min(score / 10, 1);
              return `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`;
            }}
          />
          <Background variant="dots" gap={16} size={1} color="#e5e7eb" />

          {/* Linking Panel */}
          <Panel position="top-left" className="m-4">
            <LinkingPanel
              isLinking={linkMode}
              linkSourceUser={linkSourceUser}
              onToggle={toggleLinkMode}
              onCancel={cancelLinking}
            />
          </Panel>

          {/* Stats Panel */}
          <Panel position="top-right" className="m-4">
            <div className="bg-white rounded-xl shadow-lg p-4 min-w-[200px]">
              <h3 className="font-bold text-lg mb-3 text-gray-800">Network Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Users:</span>
                  <span className="font-bold text-blue-600">{users.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Connections:</span>
                  <span className="font-bold text-green-600">{edges.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Score:</span>
                  <span className="font-bold text-purple-600">
                    {users.length > 0
                      ? (users.reduce((sum, u) => sum + (u.popularityScore || 0), 0) / users.length).toFixed(1)
                      : '0.0'}
                  </span>
                </div>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={showUserForm}
        onClose={() => setShowUserForm(false)}
        user={selectedUser}
        mode={formMode}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        username={selectedUser?.username}
      />

      {/* Notifications */}
      {error && (
        <Toast 
          message={error} 
          type="error" 
          onClose={() => setError(null)} 
        />
      )}
      {success && (
        <Toast 
          message={success} 
          type="success" 
          onClose={() => setSuccess(null)} 
        />
      )}
    </div>
  );
};

export default App;