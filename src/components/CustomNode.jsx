import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data, id }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const score = data.popularityScore || 0;
  const intensity = Math.min(score / 10, 1);
  const bgColor = `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`;
  const borderWidth = Math.max(2, Math.min(4, score / 5));

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const hobby = e.dataTransfer.getData('hobby');
    if (hobby && data.onAddHobby) {
      data.onAddHobby(id, hobby);
    }
  };

  return (
    <div
      className={`px-5 py-4 rounded-xl border-blue-500 bg-white shadow-xl min-w-[180px] hover:shadow-2xl transition-all ${
        isDragOver ? 'scale-105 border-green-500 border-4' : ''
      }`}
      style={{ 
        backgroundColor: isDragOver ? 'rgba(34, 197, 94, 0.2)' : bgColor,
        borderWidth: isDragOver ? '4px' : `${borderWidth}px`,
        borderStyle: 'solid',
        borderColor: isDragOver ? '#22c55e' : '#3b82f6',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#3b82f6',
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#3b82f6',
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#3b82f6',
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#3b82f6',
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />

      <div className="font-bold text-gray-900 text-center text-lg mb-1">
        {data.label}
      </div>
      <div className="text-sm text-gray-700 text-center font-medium">
        Age: {data.age}
      </div>
      <div className="text-xs text-gray-600 text-center mt-2 bg-white bg-opacity-50 rounded px-2 py-1">
        Popularity: {score.toFixed(1)}
      </div>
      
      {isDragOver && (
        <div className="text-xs text-green-600 text-center mt-2 font-bold animate-pulse">
          Drop hobby here!
        </div>
      )}
      
      <div className="text-xs text-gray-700 mt-3 pt-2 border-t border-gray-300">
        <div className="font-semibold mb-1">Hobbies:</div>
        <div className="flex flex-wrap gap-1">
          {data.hobbies.slice(0, 3).map((hobby, idx) => (
            <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
              {hobby}
            </span>
          ))}
          {data.hobbies.length > 3 && (
            <span className="text-gray-500 text-xs">+{data.hobbies.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomNode;