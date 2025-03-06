import React from 'react';
import { Menu } from '@headlessui/react';
import { motion } from 'framer-motion';
import { MdPerson, MdSettings, MdLogout } from 'react-icons/md';

const UserMenu = ({ onLogout }) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="p-2 hover:bg-gray-100 rounded-full">
        <MdPerson className="w-6 h-6 text-gray-600" />
      </Menu.Button>

      <Menu.Items
        as={motion.div}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
      >
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-gray-50' : ''
              } w-full px-4 py-2 text-left flex items-center gap-2`}
            >
              <MdPerson className="w-5 h-5 text-gray-600" />
              <span>Profile</span>
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-gray-50' : ''
              } w-full px-4 py-2 text-left flex items-center gap-2`}
            >
              <MdSettings className="w-5 h-5 text-gray-600" />
              <span>Settings</span>
            </button>
          )}
        </Menu.Item>
        <div className="border-t my-1" />
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={onLogout}
              className={`${
                active ? 'bg-gray-50' : ''
              } w-full px-4 py-2 text-left flex items-center gap-2 text-red-600`}
            >
              <MdLogout className="w-5 h-5" />
              <span>Logout</span>
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

export default UserMenu;