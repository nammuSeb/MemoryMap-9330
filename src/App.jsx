import React, { useState } from 'react';
import Map from './components/Map';
import AddMemoryModal from './components/AddMemoryModal';
import { AnimatePresence } from 'framer-motion';
import { MdMenu, MdPerson } from 'react-icons/md';

function App() {
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const handleAddMemory = (location) => {
    setCurrentLocation(location);
    setShowAddMemory(true);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MdMenu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">Memory</h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MdPerson className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      <main className="flex-1 relative">
        <Map onAddMemory={handleAddMemory} />
      </main>

      <AnimatePresence>
        {showAddMemory && (
          <AddMemoryModal
            location={currentLocation}
            onClose={() => setShowAddMemory(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;