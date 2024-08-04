import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { AiOutlineMail, AiOutlineLock, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

const Login: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <div className="min-h-screen flex items-center justify-center background-image">
      <div className="relative border-transparent rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="login_form">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Login</h2>
          <img src="/images/login.webp" alt="Login" />
          <br />
          <form>
            <div className="mb-4 relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                required
              />
              <AiOutlineMail className="absolute top-3 right-3 text-gray-400" />
            </div>
            <div className="mb-4 relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter your password"
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

            <div className="flex items-center justify-between mb-4">
              <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
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

            <button
              type="button"
              className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 rounded mt-4 flex items-center justify-center"
            >
              <FcGoogle size={24} className="mr-2" />
              Continue with Google
            </button>

            <div className="text-center mt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-blue-500 hover:underline"
              >
                Signup
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
