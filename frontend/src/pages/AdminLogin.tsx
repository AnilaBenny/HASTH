import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearAdmin, setAdmin, selectIsAdminAuthenticated } from '../store/slices/adminSlice';
import { toast } from 'react-toastify';
import axiosInstance from '../Axiosconfig/Axiosconfig';
import { AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAdminAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/adminHome');
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
      const response = await axiosInstance.post('/api/auth/admin/login', data);
      if (response.data && response.data.status) {
        dispatch(clearAdmin());
        dispatch(setAdmin(response.data.user));
        localStorage.setItem('admin', JSON.stringify(response.data.user));
        toast.success('Login successful');
        navigate('/admin/adminHome');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      toast.error('Error during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center background-image">
      <div className="relative border-transparent rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="login_form">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Admin Login</h2>
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
                {isPasswordVisible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline transition duration-200"
            >
              Login Now
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
