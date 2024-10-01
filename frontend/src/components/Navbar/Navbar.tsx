import { Link } from 'react-router-dom';
import {  useEffect, useState } from 'react';
import Searchbar from './Searchbar';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import './Navbar.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsUserAuthenticated, clearUser } from '../../store/slices/userSlice';
import { MdShoppingCart,MdChat, MdPerson } from 'react-icons/md';
const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  const cart = useSelector((state:any) => state.cart.cart); 
  const [cartCount,setCartCount]=useState(cart.items.length);
  console.log(cartCount,'cartcount');
  useEffect(()=>{
    setCartCount(cart.items.length)
  },[cart])

  const handleToggleNav = () => {
    setNavOpen(prev => !prev);
  };

  const handleLogout = () => {
    dispatch(clearUser());
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
          
        {isAuthenticated?
            (<><li>
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
            <Link to="/orders" className="btn2">
              <span>Orders</span>
            </Link>
          </li>
          <li>
            <Link to="/blogs" className="btn2">
              <span>Blogs</span>
            </Link>
          </li></>):(
            <>
            <li>
            <Link to="/" className="btn2">
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/" className="btn2">
              <span>Innovations</span>
            </Link>
          </li>
          <li>
            <Link to="/" className="btn2">
              <span>Products</span>
            </Link>
          </li>
          <li>
            <Link to="/" className="btn2">
              <span>Orders</span>
            </Link>
          </li>
          <li>
            <Link to="/" className="btn2">
              <span>Blogs</span>
            </Link>
          </li></>
          )}

        </ul>
      </div>

      {isAuthenticated ? (<div className="hidden lg:flex items-center">
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="btn2">
              <MdShoppingCart className="text-2xl" title="Cart" />
              {cart&&cartCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black-100">
          {cartCount}
        </span>
      )}
            </Link>
            <Link to="/chat" className="btn2">
            <MdChat className="text-2xl text-black-500 hover:text-blue-700" title="Chat" />

            </Link>
            <Link to="/userProfile" className="btn2">
              <MdPerson className="text-2xl" title="Profile" />
            </Link>
          </div>
          <button
            className="border-2 hover:bg-white p-2 rounded-3xl ml-4"
            onClick={handleLogout}
          >
            LogOut
          </button>
        </div>
      )  : (
        <div className="hidden lg:block">
          <Link to="/login" className="btn2">
            <button className="border-2 hover:bg-white p-2 rounded-3xl">
              Login/Register
            </button>
          </Link>
        </div>
      )}

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
          <Link to="/orders" className="btn2" onClick={() => setNavOpen(false)}>
            <span>Orders</span>
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
