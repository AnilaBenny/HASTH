import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FooterBanner = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email) {
      toast.success('Subscribed successfully!');
      setEmail('');
    } else {
      toast.error('Please enter an email address.');
    }
  };

  return (
    <footer className="bg-cyan-950 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <p className="text-lg">
          Sign up for our newsletter to receive updates and exclusive offers!
        </p>
        <div className="mt-4 flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-64 px-4 py-2 mr-2 text-black rounded-l-lg focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button 
            onClick={handleSubscribe} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-lg focus:outline-none"
          >
            Subscribe
          </button>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </footer>
  );
};

export default FooterBanner;