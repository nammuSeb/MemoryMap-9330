import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const MemoryCard = ({ memory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      {memory.image && (
        <img 
          src={memory.image} 
          alt={memory.title} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{memory.title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {format(new Date(memory.date), 'PPP')}
        </p>
        <p className="text-gray-600 mt-2">{memory.description}</p>
      </div>
    </motion.div>
  );
};

export default MemoryCard;