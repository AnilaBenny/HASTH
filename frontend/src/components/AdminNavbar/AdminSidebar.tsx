import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUserCog, FaPaintBrush, FaChartBar, FaList, FaShoppingCart, FaClipboardList, FaBlog } from 'react-icons/fa';

const AdminSidebar = () => {
  const menuItems = [
    { to: "/admin/adminHome", icon: FaTachometerAlt, label: "DASHBOARD" },
    { to: "/admin/userManagement", icon: FaUserCog, label: "USER MANAGEMENT" },
    { to: "/admin/creativeManagement", icon: FaPaintBrush, label: "CREATIVE MANAGEMENT" },
    { to: "/admin/reportManagement", icon: FaChartBar, label: "REPORT MANAGEMENT" },
    { to: "/admin/posts", icon: FaList, label: "POST LIST" },
    { to: "/admin/products", icon: FaShoppingCart, label: "PRODUCT LIST" },
    { to: "/admin/orderList", icon: FaClipboardList, label: "ORDER LIST" },
    { to: "/admin/blogs", icon: FaBlog, label: "CREATE BLOG" },
  ];

  return (
    <div className="sidebar relative h-screen w-64  overflow-hidden">
      <div className="absolute inset-0 bg-opacity-20 bg-white backdrop-filter backdrop-blur-sm"></div>
      <ul className="sidebar-menu p-4 relative z-10 space-y-4">
        {menuItems.map((item, index) => (
          <li key={index} className="sidebar-item relative group">
            <NavLink
              to={item.to}
              className={({ isActive }) => `
                flex items-center p-3 rounded-lg transition-all duration-300 ease-in-out
                ${isActive
                  ? 'bg-white text-blue-700 shadow-lg transform scale-105'
                  : 'bg-blue-100 bg-opacity-20 text-black hover:bg-white hover:bg-opacity-30 hover:text-black'}
              `}
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-30 flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:bg-opacity-50 transition-colors duration-300">
                <item.icon className="text-xl" />
              </div>
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-800 to-transparent opacity-50"></div>
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
        <path d="M0,10 C30,30 70,0 100,10 L100,20 L0,20 Z" fill="rgba(109, 40, 217, 0.4)" />
      </svg>
      <style>{`
        .sidebar-item {
          animation: slideIn 0.5s ease forwards;
          opacity: 0;
          transform: translateX(-20px);
        }
        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .sidebar-item:nth-child(1) { animation-delay: 0.1s; }
        .sidebar-item:nth-child(2) { animation-delay: 0.2s; }
        .sidebar-item:nth-child(3) { animation-delay: 0.3s; }
        .sidebar-item:nth-child(4) { animation-delay: 0.4s; }
        .sidebar-item:nth-child(5) { animation-delay: 0.5s; }
        .sidebar-item:nth-child(6) { animation-delay: 0.6s; }
        .sidebar-item:nth-child(7) { animation-delay: 0.7s; }
        .sidebar-item:nth-child(8) { animation-delay: 0.8s; }
      `}</style>
    </div>
  );
};

export default AdminSidebar;