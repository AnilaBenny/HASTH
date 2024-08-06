import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUserCog } from 'react-icons/fa';

const AdminSidebar: React.FC = () => {
  return (
    <div className="sidebar bg-gradient-to-b from-blue-100 via-blue-300 to-blue-500">
      <ul className="sidebar-menu p-2">
        <li className="sidebar-item mb-2"> 
          <NavLink
            to="/admin/adminHome"
            className='text-blue-950 font-bold hover:bg-blue-800; rounded-xl p-3 flex items-center'
          >
            <FaTachometerAlt className="mr-3" />
            DASHBOARD
          </NavLink>
        </li>
        <li className="sidebar-item mb-2"> 
          <NavLink
            to="/admin/userManagement"
            className="text-blue-950 font-bold hover:bg-blue-800; rounded-xl p-3 flex items-center"
            
          >
            <FaUserCog className="mr-3"/>
            USER MANAGEMENT
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;

