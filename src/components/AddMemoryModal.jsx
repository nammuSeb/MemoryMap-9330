import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdClose, MdImage, MdVideoLibrary, MdPublic, MdLock } from 'react-icons/md';
import { Dialog } from '@headlessui/react';

const AddMemoryModal = ({ onClose, location }) => {
  const [isPublic, setIsPublic] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    images: [],
    videos: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would submit the memory with location data
    console.log({ ...form, isPublic, location });
    onClose();
  };

  return (
    <Dialog
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      open={true}
      onClose={onClose}
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Create New Memory
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <textarea
                placeholder="Share your memory..."
                className="w-full p-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <MdImage className="w-5 h-5" />
                Add Image
              </button>
              <button
                type="button"
                className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <MdVideoLibrary className="w-5 h-5" />
                Add Video
              </button>
            </div>

            <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  isPublic ? 'bg-white shadow' : ''
                }`}
              >
                <MdPublic className="w-5 h-5" />
                Public
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  !isPublic ? 'bg-white shadow' : ''
                }`}
              >
                <MdLock className="w-5 h-5" />
                Private
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Memory
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default AddMemoryModal;