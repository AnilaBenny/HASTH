import { Link } from 'react-router-dom';
import { useState } from 'react';
import Searchbar from './Searchbar';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import './Navbar.css';

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);

  const handleToggleNav = () => {
    setNavOpen(prev => !prev);
  };

  return (
    <nav className="sticky-navbar navbar bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500 flex justify-between items-center mx-auto px-4 py-3 text-black">
      <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/images/logo.jpg"
            alt="Logo"
            width={50}
            height={50}
          />
          <span className="text-black font-bold text-xl">HASTH</span>
        </Link>
      </div>

      <div className="hidden lg:flex flex-grow justify-center items-center">
        <Searchbar />
      </div>

      <div className="hidden lg:flex lg:justify-evenly lg:items-center flex-grow">
        <ul className="flex space-x-4">
          <li>
            <Link to="/home" className="btn2">
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/innovations" className="btn2">
              <span>Innovations</span>
            </Link>
          </li>
          <li>
            <Link to="/products" className="btn2">
              <span>Products</span>
            </Link>
          </li>
          <li>
            <Link to="/blogs" className="btn2">
              <span>Blogs</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="hidden lg:block">
        <Link to="/login" className="btn2">
          <button className="border-2 hover:bg-white p-2 rounded-3xl">
            Login/Register
          </button>
        </Link>
      </div>

      <div className="lg:hidden flex items-center">
  <button onClick={handleToggleNav} className="focus:outline-none">
    {navOpen ? (
      <AiOutlineClose size={24} />
    ) : (
      <AiOutlineMenu size={24} />
    )}
  </button>
</div>


      {navOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-white flex flex-col items-center space-y-4 pt-20 z-50">
          <div className="mb-4">
            <Searchbar />
          </div>
          <Link to="/home" className="btn2" onClick={() => setNavOpen(false)}>
            <span>Home</span>
          </Link>
          <Link to="/innovations" className="btn2" onClick={() => setNavOpen(false)}>
            <span>Innovations</span>
          </Link>
          <Link to="/products" className="btn2" onClick={() => setNavOpen(false)}>
            <span>Products</span>
          </Link>
          <Link to="/blogs" className="btn2" onClick={() => setNavOpen(false)}>
            <span>Blogs</span>
          </Link>
          <Link to="/login" className="btn2" onClick={() => setNavOpen(false)}>
            <button>Login/Register</button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
