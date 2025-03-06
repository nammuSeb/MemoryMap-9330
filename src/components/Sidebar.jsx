import React from 'react';
import { motion } from 'framer-motion';
import { 
  MdMap, 
  MdHistory, 
  MdBookmark, 
  MdSettings, 
  MdLogout,
  MdClose
} from 'react-icons/md';

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const menuItems = [
    { icon: MdMap, label: 'Map', action: () => {} },
    { icon: MdHistory, label: 'My Memories', action: () => {} },
    { icon: MdBookmark, label: 'Saved', action: () => {} },
    { icon: MdSettings, label: 'Settings', action: () => {} },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50"
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="py-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <item.icon className="w-6 h-6 text-gray-600" />
              <span className="text-gray-700">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 flex items-center gap-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <MdLogout className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;