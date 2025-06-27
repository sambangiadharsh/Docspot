import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <motion.footer
      className="bg-gray-900 text-white py-8 px-6 mt-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* About Us */}
        <div>
          <h2 className="text-xl font-bold mb-3">About Us</h2>
          <p className="text-gray-400 text-sm">
            DocSpot is a smart healthcare platform enabling patients to find doctors, view profiles,
            and book appointments seamlessly.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-bold mb-3">Contact Us</h2>
          <p className="text-gray-400 text-sm">Email: support@docspot.com</p>
          <p className="text-gray-400 text-sm">Phone: +91-9876543210</p>
          <p className="text-gray-400 text-sm">Location: Hyderabad, India</p>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-bold mb-3">Follow Us</h2>
          <div className="flex justify-center md:justify-start gap-4 mt-2 text-2xl">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-300 transition">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-400 transition">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} DocSpot. All rights reserved.
      </p>
    </motion.footer>
  );
};

export default Footer;
