import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import './AdminNavbar.css';
import { useSelector, useDispatch } from 'react-redux';
import { clearAdmin,selectIsAdminAuthenticated } from '../../store/slices/adminSlice';

const AdminNavbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAdminAuthenticated);

  const handleToggleNav = () => {
    setNavOpen(prev => !prev);
  };

  const handleLogout = () => {
    dispatch(clearAdmin());
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

      {isAuthenticated && (
        <div className="hidden lg:block">
          <button className="border-2 hover:bg-white p-2 rounded-3xl" onClick={handleLogout}>
            Log Out
          </button>
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
          <Link to="/admin/dashboard" className="btn2" onClick={() => setNavOpen(false)}>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/users" className="btn2" onClick={() => setNavOpen(false)}>
            <span>Users</span>
          </Link>
          <Link to="/admin/settings" className="btn2" onClick={() => setNavOpen(false)}>
            <span>Settings</span>
          </Link>
          {isAuthenticated&&<button className="btn2 border-2 hover:bg-white p-2 rounded-3xl" onClick={() => {
            handleLogout();
            setNavOpen(false);
          }}>
            LogOut
          </button>}
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
