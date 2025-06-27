import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// 🌐 Rotating 3D Cube
const RotatingCube = () => {
  const ref = useRef();
  useFrame(() => {
    ref.current.rotation.x += 0.003;
    ref.current.rotation.y += 0.003;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[2.5, 2.5, 2.5]} />
      <meshStandardMaterial color="#4f46e5" emissive="#6366f1" metalness={0.7} roughness={0.2} />
    </mesh>
  );
};

const Home = () => {
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden font-sans">
      {/* 🎨 Background Canvas */}
      <Canvas className="absolute inset-0" style={{ zIndex: 0 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={60} count={8000} fade />
        <RotatingCube />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>

      {/* ✨ Foreground UI */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <motion.div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 text-center max-w-xl w-full shadow-2xl"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            🩺 Welcome to <span className="text-indigo-400">DocSpot</span>
          </motion.h1>

          <motion.p
            className="text-gray-200 text-md md:text-lg mb-6 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Your health journey starts here. Book doctor appointments quickly, securely, and easily with DocSpot.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Link
              to="/register"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-lg transition-all shadow-md"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-lg transition-all shadow-md"
            >
              Sign In
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
