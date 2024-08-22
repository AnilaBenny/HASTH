import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { toast } from 'react-toastify';

const Otp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(() => {
    localStorage.removeItem('timer');
    const savedTimer = localStorage.getItem('timer');
    return savedTimer ? parseInt(savedTimer, 10) : 60;
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      localStorage.setItem('timer', timer.toString());

      const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      localStorage.removeItem('timer');
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index]) {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    console.log("Entered OTP:", enteredOtp);

    try {
      const response = await axiosInstance.post('/api/auth/verifyOtp', { otp: enteredOtp });
      console.log(response);
      
      if (response.status) {
        navigate('/home');
      } else {
        toast.error(response.data.message || 'Failed to verify OTP');
      }
    } catch (error) {
      toast.error('An error occurred while verifying OTP');
      console.error('Error in OTP verification:', error);
    }
  };

  const resendOtp = async () => {
    setOtp(new Array(6).fill(""));
    setTimer(30);
    toast.info("OTP resent!"); 

    try {
      const email = localStorage.getItem('userEmail');
      if (email) {
        const response = await axiosInstance.post('/api/auth/resendOtp', { email });
        if (response.data.status) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message || 'Failed to resend OTP');
        }
      } else {
        toast.error('No email found in local storage');
      }
    } catch (error) {
      toast.error('An error occurred while resending OTP');
      console.error('Error in resending OTP:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <img src="/images/otp.webp" alt="OTP Verification" className="w-full h-auto mb-6" />
        <h2 className="text-2xl font-semibold text-center mb-4">Enter OTP</h2>
        <p className="text-center mb-6">Please enter the 6-digit OTP sent to your email/phone.</p>
        <div className="flex justify-center mb-4">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={data}
              onChange={(e) => handleOtpChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-10 h-12 m-2 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <div className="flex justify-center mb-4">
          {timer > 0 ? (
            <span className="text-gray-600">Time remaining: {timer} seconds</span>
          ) : (
            <button
              onClick={resendOtp}
              className="text-blue-500 hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline transition duration-200"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default Otp;
