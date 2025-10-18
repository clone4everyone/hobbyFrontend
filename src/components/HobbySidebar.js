const HobbySidebar = ({ hobbies, onDragStart }) => {
  const [search, setSearch] = useState('');
  const filtered = hobbies.filter(h => h.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Hobbies</h2>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Search hobbies..."
        />
      </div>

      <div className="space-y-2">
        {filtered.map(hobby => (
          <div
            key={hobby}
            draggable
            onDragStart={(e) => onDragStart(e, hobby)}
            className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg cursor-move hover:bg-blue-200 transition"
          >
            {hobby}
          </div>
        ))}
      </div>
    </div>
  );
};