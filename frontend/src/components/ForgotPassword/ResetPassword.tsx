import React, { useState } from 'react';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface ResetPasswordProps {
  email: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ email }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [cpasswordError, setCpasswordError] = useState('');
  const navigate = useNavigate();

  const validatePassword = () => {
    let isValid = true;

    if (newPassword.trim() === '') {
      setPasswordError('Password is required');
      isValid = false;
    } else if (newPassword.length < 6 || newPassword.length > 15) {
      setPasswordError('Password must be between 6 and 15 characters');
      isValid = false;
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?!.*\s).*$/.test(newPassword)) {
      setPasswordError('Password must contain at least one uppercase letter, one special character, and one number, and no spaces');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (confirmPassword.trim() === '') {
      setCpasswordError('Confirm password is required');
      isValid = false;
    } else if (confirmPassword !== newPassword) {
      setCpasswordError('Passwords do not match');
      isValid = false;
    } else {
      setCpasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validatePassword()) return;

    try {
      const response = await axiosInstance.put('/api/auth/resetPassword', {
        email,
        newPassword,
      });
      console.log(response);

      if (response.data && response.data.status) {
        toast.success('Password has been successfully reset');
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('An error occurred while resetting password');
      console.error('Error in resetting password:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          placeholder="Enter new password"
          required
        />
        {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          placeholder="Confirm new password"
          required
        />
        {cpasswordError && <p className="text-red-500 text-xs mt-1">{cpasswordError}</p>}
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline transition duration-200"
      >
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;
