import React, { useState } from 'react';
import { AiOutlineMail, AiOutlineLock, AiOutlineEyeInvisible, AiOutlineUser, AiOutlinePhone } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

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
  });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center background-image">
      <div className="relative border-transparent rounded-lg shadow-lg p-8 w-full max-w-2xl bg-white">
        <div className="flex flex-row">
          <div className="signup_form w-1/2 pl-8">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Signup</h2>
            <form onSubmit={handleSubmit}>
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
              </div>
              <div className="mb-4 relative">
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                />
              </div>
              <div className="mb-4 relative flex space-x-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline transition duration-200"
              >
                Signup Now
              </button>

              <div className="flex justify-center items-center mt-4">
                <div className="border-t border-gray-300 flex-grow"></div>
                <span className="mx-4 text-gray-500">or</span>
                <div className="border-t border-gray-300 flex-grow"></div>
              </div>

              <button
                type="button"
                className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 rounded mt-4 flex items-center justify-center"
              >
                <FcGoogle size={24} className="mr-2" />
                Continue with Google
              </button>

              <div className="text-center mt-4">
                Already have an account?{' '}
                <button type="button" onClick={() => navigate('/login')} className="text-blue-500 hover:underline">
                  Login
                </button>
              </div>
            </form>
          </div>
          <div className="w-1/2">
            <img src="/images/register.jpg" alt="Register" className="w-50 h-25" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
