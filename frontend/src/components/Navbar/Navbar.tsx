
import React from 'react'


const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/images/vite.svg" alt="Logo" className="h-10 mr-4" />
        <span className="text-xl font-bold">HASTH</span>
      </div>
     </nav>
  )
}

export default Navbar
