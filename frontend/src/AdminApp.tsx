import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNavbar from './components/AdminNavbar/AdminNavbar';

const AdminApp = () => {
  return (
    <>
      <AdminNavbar />
      <ToastContainer  position="top-center" />
      <Outlet />
    </>
  );
};

export default AdminApp;