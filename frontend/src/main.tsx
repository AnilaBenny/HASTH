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
import { GoogleOAuthProvider } from '@react-oauth/google';
import ForgotPasswordPage from './pages/forgotPasswordPage';
import Profile from './pages/Profile';
import CreativeLogin from './pages/CreativeLogin';
import ErrorPage from './pages/ErrorPage(401)';
import CreativeManagement from './pages/CreativeManagement';
import Innovations from './pages/Innovations';
import ProductPage from './pages/ProductPage';
import UserProfilePage from './pages/UserProfilePage';
import Adminposts from './pages/AdminPosts';
import Adminproducts from './pages/Adminproducts';
import ReportManagement from './pages/ReportManagement';
import ProductDetailPage from './pages/ProductDetailPage';
import UserDetailPage from './pages/UserDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPages from './pages/OrderConfirmationPages';
import OrderPage from './pages/OrderPage'
import ChatPage from './pages/ChatPage';
import VideoCall from './pages/VideoCall';

const userRoutes = (
  <Route path='/' element={<App />}>
    <Route index={true} element={<Landingpage />} />
    <Route element={<PublicRoute />}>
      <Route path='401' element={<ErrorPage/>} />
      <Route path='login' element={<Loginpage />} />
      <Route path='creativeLogin' element={<CreativeLogin />} />
      <Route path='register' element={<Registerpage />} />
      <Route path='forgotPassword' element={<ForgotPasswordPage/>} />
    </Route>
    <Route path='verifyOtp' element={<Otppage />} />
    <Route element={<PrivateRoute />}>
      <Route path='home' element={<Home />} />
      <Route path='profile' element={<Profile/>}/>
      <Route path='userProfile' element={<UserProfilePage/>}/>
      <Route path='innovations' element={<Innovations/>}/>
      <Route path='products' element={<ProductPage/>}/>
      <Route path='productDetail' element={<ProductDetailPage/>}/>
      <Route path='userPage' element={<UserDetailPage/>}/>
      <Route path='cart' element={<CartPage/>}/>
      <Route path='checkout' element={<CheckoutPage/>}/>
      <Route path='order-confirmation' element={<OrderConfirmationPages/>}/>
      <Route path='orders' element={<OrderPage/>}/>
      <Route path='chat' element={<ChatPage/>}/>
      <Route path='/videoCall/:roomId' element={<VideoCall/>} ></Route>
    </Route>
  </Route>
)
const adminRoutes=(
  <Route path='/admin' element={<AdminApp/>}>
    <Route index={true} element={<AdminLogin/>}/>
    <Route element={<AdminPrivateRoute/>}>
      <Route path='adminHome' element={<AdminHome/>}/>
      <Route path='userManagement' element={<UserManagement/>}/>
      <Route path='creativeManagement' element={<CreativeManagement/>}/>
      <Route path='reportManagement' element={<ReportManagement/>}/>
      <Route path='posts' element={<Adminposts/>}/>
      <Route path='products' element={<Adminproducts/>}/>
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
      <GoogleOAuthProvider clientId="454780597057-m0hi77khg1hntm0l1qj2bm5as7qvbtng.apps.googleusercontent.com">
      <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);