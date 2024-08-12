import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser, setUser, selectIsUserAuthenticated } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { AiOutlineMail, AiOutlineLock, AiOutlineEyeInvisible } from 'react-icons/ai';
import Loading from '../../Loading/Loading';
import './Login.css';
import { FcGoogle } from 'react-icons/fc';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    const userString: string | null = queryParams.get('user');

    if (status === 'true' && userString) {
      try {
        const user = JSON.parse(userString);
        dispatch(setUser(user));
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/home');
      } catch (error) {
        console.error('Error parsing user:', error);
        toast.error('Failed to parse user data.');
      }
    } else if (status === 'false') {
      toast.error('User already exists. Please login.');
    }
  }, [location, navigate, dispatch]);

  const handleGoogleSignIn = async () => {
    window.location.href = 'http://localhost:8080/api/auth/google';
  };

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

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/api/auth/login', data);
      console.log(response.data);

      if (response.data.data.isBlocked) {
        toast.error('Your account has been blocked. Please contact support.');
      } else if (response.data.data.role !== 'user') {
        toast.error('Please login with the correct credentials');
      } else if (response.data && response.data.status) {
        toast.success('Login successful');
        dispatch(clearUser());
        dispatch(setUser(response.data.data));
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/home');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Error during login');
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <div className="min-h-screen flex items-center justify-center background-image">
      <div className="relative border-transparent rounded-lg shadow-lg p-8 w-full max-w-md bg-white">

        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Login</h2>
        <img src="/images/login.webp" alt="Login" className="w-full h-auto mb-4" />
        <form onSubmit={handleLogin}>
          <div className="mb-4 relative">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
            />
            <AiOutlineMail className="absolute top-3 right-3 text-gray-400" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4 relative">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
            />
            <AiOutlineLock className="absolute top-3 right-10 text-gray-400" />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-3 right-3 text-gray-400"
            >
              <AiOutlineEyeInvisible />
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="flex justify-center mb-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loading />
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>
          <div className="flex justify-center mb-4">
          <button
              type="button"
              className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 rounded mt-4 flex items-center justify-center"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle size={24} className="mr-2" />
              Continue with Google
            </button>
          </div>
          <div className="text-center mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </div>
          <div className="text-center mt-4">
              Want to become a creative?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                Become a creative
              </Link>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Login ;
