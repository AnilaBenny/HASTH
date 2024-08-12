import React, { useState,useEffect } from 'react';
import { AiOutlineMail, AiOutlineLock, AiOutlineEyeInvisible, AiOutlineUser, AiOutlinePhone } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { toast } from 'react-toastify';
import Loading from '../../Loading/Loading';
import { useNavigate,useLocation } from 'react-router-dom';
import { initializeUser,setUser } from '../../store/slices/userSlice';
import {  useDispatch } from 'react-redux';
 const Register= function (){
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
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
  });

  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [cpasswordError, setCpasswordError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [skillsError, setSkillsError] = useState('');
  const [educationError, setEducationError] = useState('');
  const [specificationError, setSpecificationError] = useState('');
  const [streetError, setStreetError] = useState('');
  const [cityError, setCityError] = useState('');
  const [stateError, setStateError] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [isLoading,setisLoading]=useState(false);


  const validate = () => {
    let isValid = true;
    const {
      name,
      email,
      password,
      confirmPassword,
      mobile,
      skills,
      education,
      specification,
      street,
      city,
      state,
      zipCode,
      role
    } = formData;

    if (name.trim() === '') {
      setNameError('Name is required');
      isValid = false;
    } else if (name.length < 3 || name.length > 15) {
      setNameError('Name must be between 3 and 15 characters long');
      isValid = false;
    } else if (!/^[a-zA-Z\s]*$/.test(name)) {
      setNameError('Name cannot contain numbers or special characters');
      isValid = false;
    } else {
      setNameError('');
    }

    const emailRegex = /^[a-zA-Z0-9_]+@gmail\.com$/;
    if (email.trim() === '') {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Valid email is required');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.trim() === '') {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6 || password.length > 15) {
      setPasswordError('Password must be between 6 and 15 characters');
      isValid = false;
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?!.*\s).*$/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter, one special character, and one number, and no spaces');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (confirmPassword.trim() === '') {
      setCpasswordError('Confirm password is required');
      isValid = false;
    } else if (confirmPassword !== password) {
      setCpasswordError('Passwords do not match');
      isValid = false;
    } else {
      setCpasswordError('');
    }

    if (mobile.trim() === '') {
      setMobileError('Mobile number is required');
      isValid = false;
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMobileError('Invalid mobile number format. Must start with a digit from 6 to 9 and be 10 digits long');
      isValid = false;
    } else {
      setMobileError('');
    }

    if (skills.trim() === '') {
      setSkillsError('Skills are required');
      isValid = false;
    } else {
      setSkillsError('');
    }

    if (education.trim() === '') {
      setEducationError('Education is required');
      isValid = false;
    } else {
      setEducationError('');
    }

    if (specification.trim() === '') {
      setSpecificationError('Specification is required');
      isValid = false;
    } else {
      setSpecificationError('');
    }

    if (street.trim() === '') {
      setStreetError('Street is required');
      isValid = false;
    } else {
      setStreetError('');
    }

    if (city.trim() === '') {
      setCityError('City is required');
      isValid = false;
    } else {
      setCityError('');
    }

    if (state.trim() === '') {
      setStateError('State is required');
      isValid = false;
    } else {
      setStateError('');
    }

    if (zipCode.trim() === '' || !/^\d{5,6}$/.test(zipCode)) {
      setZipCodeError('Valid Zip Code is required');
      isValid = false;
    } else {
      setZipCodeError('');
    }

    if (role.trim() === '') {
      setRoleError('Role is required');
      isValid = false;
    } else {
      setRoleError('');
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) {
      return; 
    }
    try {
      const {
        name,
        email,
        password,
        mobile,
        skills,
        education,
        specification,
        street,
        city,
        state,
        zipCode,
        role
      } = formData;
      const data = {
        name,
        email,
        password,
        mobile,
        skills,
        education,
        specification,
        street,
        city,
        state,
        zipCode,
        role
      };
      setisLoading(true);
      const response = await axiosInstance.post('/api/auth/register', data);

      if (response.data && response.data.status) {
        navigate('/verifyOtp');
        localStorage.removeItem('userEmail');
        localStorage.setItem('userEmail', email);
      } else {
        toast.warn(response.data.data);
      }
    } catch (err) {
      console.error('Error during registration:', err);
      toast.error('User registration failed');
    }
  };

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    const userString:any = queryParams.get('user');
    const token:any = queryParams.get('token');

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
  }, [location, navigate]);

  const handleGoogleSignIn = async () => {
    window.location.href = 'http://localhost:8080/api/auth/google';
  };



  return (
    <div className="min-h-screen flex items-center justify-center background-image">
      <div className="relative border-transparent rounded-lg shadow-lg p-8 w-full max-w-2xl bg-white">
        <div className="flex flex-row">
          <div className="signup_form w-1/2 pl-8">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Signup</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
              <div className="mb-4 relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  
                />
                <AiOutlineUser className="absolute top-3 right-3 text-gray-400" />
                {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
              </div>
              <div className="mb-4 relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  
                />
                <AiOutlineMail className="absolute top-3 right-3 text-gray-400" />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>
              <div className="mb-4 relative">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
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
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
              </div>
              <div className="mb-4 relative">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  
                />
                <AiOutlineLock className="absolute top-3 right-10 text-gray-400" />
                {cpasswordError && <p className="text-red-500 text-sm mt-1">{cpasswordError}</p>}
              </div>
              <div className="mb-4 relative">
                <input
                  type="text"
                  name="mobile"
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  
                />
                <AiOutlinePhone className="absolute top-3 right-3 text-gray-400" />
                {mobileError && <p className="text-red-500 text-sm mt-1">{mobileError}</p>}
              </div>
              <div className="mb-4 relative">
                <input
                  type="text"
                  name="skills"
                  placeholder="Enter your skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  
                />
                {skillsError && <p className="text-red-500 text-sm mt-1">{skillsError}</p>}
              </div>
              <div className="mb-4 relative">
                <input
                  type="text"
                  name="education"
                  placeholder="Enter your education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  
                />
                {educationError && <p className="text-red-500 text-sm mt-1">{educationError}</p>}
              </div>
              <div className="mb-4 relative">
                <input
                  type="text"
                  name="specification"
                  placeholder="Enter your specification"
                  value={formData.specification}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  
                />
                {specificationError && <p className="text-red-500 text-sm mt-1">{specificationError}</p>}
              </div>
              <div className="mb-4 relative">
                <input
                  type="text"
                  name="street"
                  placeholder="Enter your street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  
                />
                {streetError && <p className="text-red-500 text-sm mt-1">{streetError}</p>}
              </div>
              <div className="mb-4 relative">
                <input
                  type="text"
                  name="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  
                />
                {cityError && <p className="text-red-500 text-sm mt-1">{cityError}</p>}
              </div>
              <div className="mb-4 relative">
                <input
                  type="text"
                  name="state"
                  placeholder="Enter your state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  
                />
                {stateError && <p className="text-red-500 text-sm mt-1">{stateError}</p>}
              </div>
              <div className="mb-4 relative">
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Enter your zip code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  
                />
                {zipCodeError && <p className="text-red-500 text-sm mt-1">{zipCodeError}</p>}
              </div>
              <div className="mb-4 relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  
                >
                  <option value="user">User</option>
                  <option value="creative">Creative</option>
                </select>
                {roleError && <p className="text-red-500 text-sm mt-1">{roleError}</p>}
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
                >{isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loading /> 
                  </div>
                ) : (
                  'Signup' 
                )}
                  
                </button>
              </div>
              <button
              type="button"
              className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 rounded mt-4 flex items-center justify-center"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle size={24} className="mr-2" />
              Continue with Google
            </button>
              <div className="text-center mt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-500 hover:underline"
              >
                login
              </button>
            </div>
            </form>
            
          </div>
          <div className="w-1/2">
            <img src="/images/register.jpg" alt="Register" className="w-full h-auto" />
      </div>
        </div>
      </div>
    </div>
  );
};
export {Register};

