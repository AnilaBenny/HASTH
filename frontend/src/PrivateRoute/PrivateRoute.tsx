import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAdminAuthenticated } from '../store/slices/adminSlice';
import { selectIsUserAuthenticated } from '../store/slices/userSlice';


export const PublicRoute = () => {
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  console.log(isAuthenticated);
  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
};

export const PrivateRoute = () => {
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  console.log(isAuthenticated);
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};


export const AdminPrivateRoute = () => {
  const  isAuthenticated  = useSelector(selectIsAdminAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to='/admin' replace />;
};

