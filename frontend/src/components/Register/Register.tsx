import React, { useState } from 'react';
import { AiOutlineMail, AiOutlineLock, AiOutlineEyeInvisible, AiOutlineUser, AiOutlinePhone } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { toast } from 'react-toastify';

const Register: React.FC = () => {
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

  // Error state variables
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

  const navigate = useNavigate();

  const clearValidationErrors = () => {
    setTimeout(() => {
      setNameError("");
      setEmailError("");
      setPasswordError("");
      setCpasswordError("");
      setMobileError("");
      setSkillsError("");
      setEducationError("");
      setSpecificationError("");
      setStreetError("");
      setCityError("");
      setStateError("");
      setZipCodeError("");
      setRoleError("");
    }, 3000); 
  };

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

    if (name.trim() === "") {
      setNameError("Name is required");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === "" || !emailRegex.test(email)) {
      setEmailError("Valid email is required");
      isValid = false;
    }

    if (password.trim() === "") {
      setPasswordError("Password is required");
      isValid = false;
    }

    if (confirmPassword !== password) {
      setCpasswordError("Passwords do not match");
      isValid = false;
    }

    if (mobile.trim() === "" || !/^\d{10}$/.test(mobile)) {
      setMobileError("Valid mobile number is required");
      isValid = false;
    }

    if (skills.trim() === "") {
      setSkillsError("Skills are required");
      isValid = false;
    }

    if (education.trim() === "") {
      setEducationError("Education is required");
      isValid = false;
    }

    if (specification.trim() === "") {
      setSpecificationError("Specification is required");
      isValid = false;
    }

    if (street.trim() === "") {
      setStreetError("Street is required");
      isValid = false;
    }

    if (city.trim() === "") {
      setCityError("City is required");
      isValid = false;
    }

    if (state.trim() === "") {
      setStateError("State is required");
      isValid = false;
    }

    if (zipCode.trim() === "" || !/^\d{5,6}$/.test(zipCode)) {
      setZipCodeError("Valid Zip Code is required");
      isValid = false;
    }

    if (role.trim() === "") {
      setRoleError("Role is required");
      isValid = false;
    }

    if (!isValid) {
      clearValidationErrors();
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) {
      return; // Exit if validation fails
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
      const response = await axiosInstance.post("/api/auth/register", data);

      if (response.data && response.data.status) {
        navigate('/verifyOtp');
        localStorage.removeItem("userEmail");
        localStorage.setItem("userEmail", email);
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
                />
                {zipCodeError && <p className="text-red-500 text-sm mt-1">{zipCodeError}</p>}
              </div>
              <div className="mb-4 relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                  required
                >
                  <option value="user">User</option>
                  <option value="creator">Creator</option>
                </select>
                {roleError && <p className="text-red-500 text-sm mt-1">{roleError}</p>}
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
                >
                  Signup
                </button>
              </div>
            </form>
            <div className="flex justify-center mt-6">
              <FcGoogle className="text-2xl mr-2" />
              <button className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 focus:outline-none">
                Signup with Google
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

export default Register;