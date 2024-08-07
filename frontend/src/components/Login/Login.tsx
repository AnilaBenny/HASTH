import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser, setUser, selectIsUserAuthenticated } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { AiOutlineMail, AiOutlineLock, AiOutlineEyeInvisible } from 'react-icons/ai';
import { GoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsUserAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const validateForm = () => {
    let valid = true;
    let errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
      valid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = { email, password };

    try {
      const response = await axiosInstance.post('/api/auth/login', data);
      console.log(response.data);
      
      if (response.data.data.isBlocked) {
        toast.error('Your account has been blocked. Please contact support.');
      } 
      else if (response.data && response.data.status) {
        toast.success('Login successful');
        dispatch(clearUser());
        dispatch(setUser(response.data.data));
        localStorage.setItem('User', JSON.stringify(response.data));
        navigate('/home');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Error during login');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const { credential } = credentialResponse;
      console.log('credential',credential);
      
      const response = await axiosInstance.post('/api/auth/google', { idToken: credential });
      if (response.data && response.data.status) {
        toast.success('Login successful');
        dispatch(clearUser());
        dispatch(setUser(response.data.data));
        localStorage.setItem('User', JSON.stringify(response.data));
        navigate('/home');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      toast.error('Error during Google login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center background-image">
      <div className="relative border-transparent rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="login_form">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Login</h2>
          <img src="/images/login.webp" alt="Login" className="w-full h-auto mb-4" />
          <form onSubmit={handleLogin}>
            <div className="mb-4 relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700`}
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              <AiOutlineMail className="absolute top-3 right-3 text-gray-400" />
            </div>
            <div className="mb-4 relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700`}
                required
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              <AiOutlineLock className="absolute top-3 right-10 text-gray-400" />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-3 right-3 text-gray-400"
              >
                <AiOutlineEyeInvisible />
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <Link to="/forgotPassword" className="text-blue-500 hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline transition duration-200"
            >
              Login Now
            </button>

            <div className="flex justify-center items-center mt-4">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="mx-4 text-gray-500">or</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>

            <div className="w-full flex justify-center mt-4">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => toast.error('Google login failed')}
                useOneTap={false}
                promptMomentNotification={() => {}}
              />
            </div>

            <div className="text-center mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:underline">
                Signup
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
