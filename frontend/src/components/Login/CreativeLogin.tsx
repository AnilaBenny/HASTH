import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser, setUser, selectIsUserAuthenticated } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';
import axiosInstance, { setAuthInfo } from '../../Axiosconfig/Axiosconfig';
import { AiOutlineMail, AiOutlineLock, AiOutlineEyeInvisible } from 'react-icons/ai';
import { GoogleLogin } from '@react-oauth/google';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CreativeLogin: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsUserAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleLogin = async (values: { email: string; password: string }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', values);
      setAuthInfo(response.data.accessToken,response.data.data.role);
     
      
      if(!response.data.status){
        toast.error('User is not found');
      }
      if(response.status){
      if (response.data.data.isBlocked) {
        toast.error('Your account has been blocked. Please contact support.');
      } else if (!response.data.data.isVerified) {
        toast.error('Your account is not verified by admin. Please contact support.');
      } else if (response.data.data.role !== 'creative') {
        toast.error('Please login in to user Login');
      } else if (response.data && response.data.status) {
        toast.success('Login successful');
        dispatch(clearUser());
        dispatch(setUser(response.data.data));
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/home');
      }else {
        toast.error(response.data.message || 'Login failed');
      }}
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Error during login');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const { credential } = credentialResponse;
      console.log('credential', credential);
      
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
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Creative Login</h2>
          <img src="/images/login.webp" alt="Login" className="w-full h-auto mb-4" />
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4 relative">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  />
                  <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                  <AiOutlineMail className="absolute top-3 right-3 text-gray-400" />
                </div>
                <div className="mb-4 relative">
                  <Field
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  />
                  <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
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
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline transition duration-200"
                >
                  Login Now
                </button>
              </Form>
            )}
          </Formik>

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
          <div className="text-center mt-4">
            Want to become a user?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Become a user
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeLogin;