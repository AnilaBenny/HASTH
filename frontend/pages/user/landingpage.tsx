
import React from 'react'

const LandingPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <header className="w-full p-4 bg-white shadow-md">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">HASTH</div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Services</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Contact</a>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          A Helping Hasth for Your Ideas
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We help you bring your innovative ideas to life and introduce your products to society.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="px-4 py-2 bg-blue-600 text-white rounded shadow-md hover:bg-blue-700">
            Get Started
          </a>
          <a href="#" className="px-4 py-2 bg-gray-200 text-gray-800 rounded shadow-md hover:bg-gray-300">
            Learn More
          </a>
        </div>
      </main>

      <footer className="w-full p-4 bg-white shadow-md">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          &copy; 2024 HASTH. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
