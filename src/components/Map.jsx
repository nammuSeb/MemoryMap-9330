import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
import { motion } from 'framer-motion';
import { MdMyLocation, MdAdd, MdPlace } from 'react-icons/md';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN';

const Map = ({ onAddMemory }) => {
  const [viewport, setViewport] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 13
  });
  const [userLocation, setUserLocation] = useState(null);
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setViewport(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        error => console.error(error)
      );
    }
  }, []);

  const handleAddMemory = () => {
    if (userLocation) {
      onAddMemory(userLocation);
    }
  };

  return (
    <div className="relative w-full h-full">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={evt => setViewport(evt.viewport)}
      >
        <NavigationControl position="top-right" />
        
        {userLocation && (
          <Marker
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
            >
              <div className="w-4 h-4 bg-blue-300 rounded-full animate-pulse" />
            </motion.div>
          </Marker>
        )}

        {memories.map((memory, index) => (
          <Marker
            key={index}
            latitude={memory.latitude}
            longitude={memory.longitude}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="cursor-pointer"
            >
              <MdPlace className="w-8 h-8 text-red-500 transform -translate-y-full" />
            </motion.div>
          </Marker>
        ))}
      </ReactMapGL>

      <div className="absolute bottom-6 right-6 flex flex-col gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="bg-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          onClick={() => {
            if (userLocation) {
              setViewport(prev => ({
                ...prev,
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                zoom: 15
              }));
            }
          }}
        >
          <MdMyLocation className="w-6 h-6 text-primary-600" />
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="bg-primary-600 p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          onClick={handleAddMemory}
        >
          <MdAdd className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </div>
  );
};

export default Map;