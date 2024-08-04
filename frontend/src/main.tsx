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

const userRoutes=(
<Route path='/' element={<App/>}>
<Route index={true} element={<Landingpage/>}/>
<Route path='/login' element={<Loginpage/>}/>
<Route path='/register' element={<Registerpage/>}/>
</Route>
)

const router=createBrowserRouter(createRoutesFromElements(userRoutes))



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);


