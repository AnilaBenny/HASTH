import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css'
import { Provider } from 'react-redux';
import { store } from './store/store';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import App from './App';
import Landingpage from './pages/Landingpage';
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage';
import Otppage from './pages/Otppage';
import Home from './pages/Home';
import { AdminPrivateRoute, PrivateRoute, PublicRoute } from './PrivateRoute/PrivateRoute';
import AdminApp from './AdminApp';
import AdminLogin from './pages/AdminLogin';
import AdminHome from './pages/AdminHome';
import UserManagement from './pages/UserManagement';

const userRoutes = (
  <Route path='/' element={<App />}>
    <Route index={true} element={<Landingpage />} />
    <Route element={<PublicRoute />}>
      <Route path='login' element={<Loginpage />} />
      <Route path='register' element={<Registerpage />} />
    </Route>
    <Route path='verifyOtp' element={<Otppage />} />
    <Route element={<PrivateRoute />}>
      <Route path='home' element={<Home />} />
    </Route>
  </Route>
)
const adminRoutes=(
  <Route path='/admin' element={<AdminApp/>}>
    <Route index={true} element={<AdminLogin/>}/>
    <Route element={<AdminPrivateRoute/>}>
      <Route path='adminHome' element={<AdminHome/>}/>
      <Route path='userManagement' element={<UserManagement/>}/>
    </Route>
  </Route>
)



const allRoutes=(
  <>
  {userRoutes}
  {adminRoutes}
  </>
)
const router = createBrowserRouter(createRoutesFromElements(allRoutes))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);