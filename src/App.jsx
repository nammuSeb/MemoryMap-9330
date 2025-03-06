import React, { useState } from 'react';
import Map from './components/Map';
import AddMemoryModal from './components/AddMemoryModal';
import Sidebar from './components/Sidebar';
import UserMenu from './components/UserMenu';
import { AnimatePresence } from 'framer-motion';
import { MdMenu } from 'react-icons/md';

function App() {
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddMemory = (location) => {
    setCurrentLocation(location);
    setShowAddMemory(true);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <MdMenu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">
              Memory
            </h1>
          </div>
          <UserMenu onLogout={handleLogout} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        <Map onAddMemory={handleAddMemory} />
      </main>

      {/* Modals and Overlays */}
      <AnimatePresence>
        {showAddMemory && (
          <AddMemoryModal
            location={currentLocation}
            onClose={() => setShowAddMemory(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;