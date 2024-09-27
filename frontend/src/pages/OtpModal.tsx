import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Axiosconfig/Axiosconfig';

interface OtpModalProps {
  closeModal: () => void;
  email: string;
}

const OtpModal: React.FC<OtpModalProps> = ({ closeModal, email }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const validatePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    console.log("Entered OTP:", enteredOtp);
    try {
      const response = await axiosInstance.post('/api/auth/checkOtp', { otp: enteredOtp });
      console.log(response);
     
      if (response.data && response.data.status) {
        setIsOtpVerified(true);
        toast.success('OTP verified successfully');
      } else {
        toast.error(response.data.message || 'Failed to verify OTP');
      }
    } catch (error) {
      toast.error('An error occurred while verifying OTP');
      console.error('Error in OTP verification:', error);
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) return;
    try {
      const response = await axiosInstance.put('/api/auth/resetPassword', {
        email,
        newPassword,
      });
      console.log(response);
      if (response.data && response.data.status) {
        toast.success('Password has been successfully reset');
        navigate('/userProfile');
      } else {
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('An error occurred while resetting password');
      console.error('Error in resetting password:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
          onClick={closeModal}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6">Enter OTP</h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-6">
          We've sent you a confirmation code via email. Please enter it below.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirmation Code</label>
          <div className="flex justify-center gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                ref={el => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-xl border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-shadow dark:bg-gray-700 dark:text-white"
                value={data}
                onChange={e => handleOtpChange(e.target, index)}
                onKeyDown={e => {
                  if (e.key === "Backspace" && !otp[index]) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                disabled={isOtpVerified}
              />
            ))}
          </div>
          {isOtpVerified && (
            <div className="flex items-center justify-center mt-2 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </div>
          )}
        </div>

        {!isOtpVerified && (
          <div className="flex justify-between items-center mb-6">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>

          </div>
        )}

        {isOtpVerified && (
          <>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
              <input
                id="newPassword"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-shadow dark:bg-gray-700 dark:text-white"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-shadow dark:bg-gray-700 dark:text-white"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                onClick={handleResetPassword}
              >
                Reset Password
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OtpModal;