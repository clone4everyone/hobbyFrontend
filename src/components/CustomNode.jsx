import React from 'react';

const CustomNode = ({ data }) => {
  const score = data.popularityScore || 0;
  const intensity = Math.min(score / 10, 1);
  const bgColor = `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`;
  const borderWidth = Math.max(2, Math.min(4, score / 5));

  return (
    <div
      className="px-5 py-4 rounded-xl border-blue-500 bg-white shadow-xl min-w-[180px] hover:shadow-2xl transition-shadow"
      style={{ 
        backgroundColor: bgColor,
        borderWidth: `${borderWidth}px`,
        borderStyle: 'solid'
      }}
    >
      <div className="font-bold text-gray-900 text-center text-lg mb-1">
        {data.label}
      </div>
      <div className="text-sm text-gray-700 text-center font-medium">
        Age: {data.age}
      </div>
      <div className="text-xs text-gray-600 text-center mt-2 bg-white bg-opacity-50 rounded px-2 py-1">
        Popularity: {score.toFixed(1)}
      </div>
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