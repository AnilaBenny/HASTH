import React, { useState, useEffect } from 'react';
import { AiOutlineMail, AiOutlineLock, AiOutlineEyeInvisible, AiOutlineUser, AiOutlinePhone } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { toast } from 'react-toastify';
import Loading from '../../Loading/Loading';
import { useNavigate, useLocation } from 'react-router-dom';
import { initializeUser, setUser } from '../../store/slices/userSlice';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import apiService from '../../Services/Apicalls';

const Register = function () {
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGoogleSignIn } = useApiService();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    skills: '',
    education: '',
    specification: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    role: 'user',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'Name cannot contain numbers or special characters')
      .min(3, 'Name must be between 3 and 15 characters long')
      .max(15, 'Name must be between 3 and 15 characters long')
      .required('Name is required'),
    email: Yup.string()
      .matches(/^[a-zA-Z0-9_]+@gmail\.com$/, 'Valid email is required')
      .required('Email is required'),
    password: Yup.string()
      .matches(
        /(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?!.*\s).*$/,
        'Password must contain at least one uppercase letter, one special character, and one number, and no spaces'
      )
      .min(6, 'Password must be between 6 and 15 characters')
      .max(15, 'Password must be between 6 and 15 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    mobile: Yup.string()
      .matches(/^[6-9]\d{9}$/, 'Invalid mobile number format. Must start with a digit from 6 to 9 and be 10 digits long')
      .required('Mobile number is required'),
    skills: Yup.string().required('Skills are required'),
    education: Yup.string().required('Education is required'),
    specification: Yup.string().required('Specification is required'),
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string()
      .matches(/^\d{5,6}$/, 'Valid Zip Code is required')
      .required('Zip Code is required'),
    role: Yup.string().required('Role is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/api/auth/register', values);

      if (response.data && response.data.status) {
        navigate('/verifyOtp');
        localStorage.removeItem('userEmail');
        localStorage.setItem('userEmail', values.email);
      } else {
        toast.warn(response.data.data);
      }
    } catch (err) {
      console.error('Error during registration:', err);
      toast.error('User registration failed');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    const userString:string | null = queryParams.get('user');
    const token:string | null= queryParams.get('token');

    if (status === 'true') {
      try {
        const user = JSON.parse(userString); 
        dispatch(setUser(user)); 
        dispatch(initializeUser(token));
        
        navigate('/home');
      } catch (error) {
        console.error('Error parsing user:', error);
        toast.error('Failed to parse user data.');
      }
    } else if (status === 'false') {
      toast.error('User already exists. Please login.');
    }
  }, [location, navigate, dispatch]);


  return (
    <div className="min-h-screen flex items-center justify-center background-image">
      <div className="relative border-transparent rounded-lg shadow-lg p-8 w-full max-w-2xl bg-white">
        <div className="flex flex-row">
          <div className="signup_form w-1/2 pl-8">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Signup</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4 relative">
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                    />
                    <AiOutlineUser className="absolute top-3 right-3 text-gray-400" />
                    <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4 relative">
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                    />
                    <AiOutlineMail className="absolute top-3 right-3 text-gray-400" />
                    <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4 relative">
                    <Field
                      type={isPasswordVisible ? 'text' : 'password'}
                      name="password"
                      placeholder="Create password"
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
                    <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4 relative">
                    <Field
                      type={isPasswordVisible ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                    />
                    <AiOutlineLock className="absolute top-3 right-10 text-gray-400" />
                    <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4 relative">
                    <Field
                      type="text"
                      name="mobile"
                      placeholder="Enter your mobile number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                    />
                    <AiOutlinePhone className="absolute top-3 right-3 text-gray-400" />
                    <ErrorMessage name="mobile" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4 relative">
                    <Field
                      type="text"
                      name="skills"
                      placeholder="Enter your skills"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                    />
                    <ErrorMessage name="skills" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4 relative">
                    <Field
                      type="text"
                      name="education"
                      placeholder="Enter your education"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                    />
                    <ErrorMessage name="education" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4 relative">
                    <Field
                      type="text"
                      name="specification"
                      placeholder="Enter your specification"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                    />
                    <ErrorMessage name="specification" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4 relative">
                    <Field
                      type="text"
                      name="street"
                      placeholder="Enter your street"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                    />
                    <ErrorMessage name="street" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4 relative">
                    <Field
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                    />
                    <ErrorMessage name="city" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4 relative">
                    <Field
                      type="text"
                      name="state"
                      placeholder="Enter your state"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                    />
                    <ErrorMessage name="state" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4 relative">
                    <Field
                      type="text"
                      name="zipCode"
                      placeholder="Enter your zip code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                    />
                    <ErrorMessage name="zipCode" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4 relative">
                    <Field
                      as="select"
                      name="role"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                    >
                      <option value="user">User</option>
                      <option value="creative">Creative</option>
                    </Field>
                    <ErrorMessage name="role" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loading /> 
                        </div>
                      ) : (
                        'Signup' 
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            <button
              type="button"
              className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 rounded mt-4 flex items-center justify-center"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle size={24} className="mr-2" />
              Continue with Google
            </button>
            <div className="text-center mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-500 hover:underline"
              >
                Login
              </button>
            </div>
          </div>
          <div className="w-1/2">
            <img src="/images/register.jpg" alt="Register" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Register };