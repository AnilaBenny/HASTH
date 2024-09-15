import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { toast } from 'react-toastify';
import { AiOutlineMail } from 'react-icons/ai';
import ResetPassword from './ResetPassword';

const ForgotPasswordEmail: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [timer, setTimer] = useState(() => {
    const savedTimer = localStorage.getItem('timer');
    return savedTimer ? parseInt(savedTimer, 10) : 60;
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


  useEffect(() => {
    if (timer > 0) {
      localStorage.setItem('timer', timer.toString());

      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      localStorage.removeItem('timer');
    }
  }, [timer]);

  const handleSendOTP = async () => {
    try {
      const response = await axiosInstance.post('/api/auth/forgotPassword', { email });
      console.log(response);

      if (response.data && response.data.status) {
        toast.success('OTP sent to your email');
        setEmailSent(true);
        localStorage.setItem('userEmail', email);
      } else {
        toast.error(response.data.message || 'Please register your email');
      }
    } catch (error) {
      toast.error('Error sending OTP');
      console.error('Error:', error);
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index]) {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join('');
    console.log('Entered OTP:', enteredOtp);

    try {
      const response = await axiosInstance.post('/api/auth/checkOtp', { email, otp: enteredOtp });
      console.log(response);

      if (response.data.status) {
        toast.success('OTP verified');
        setOtpVerified(true);
      } else {
        toast.error(response.data.message || 'Failed to verify OTP');
      }
    } catch (error) {
      toast.error('An error occurred while verifying OTP');
      console.error('Error in OTP verification:', error);
    }
  };

  const resendOtp = async () => {
    setOtp(new Array(6).fill(''));
    setTimer(60);
    toast.info('OTP resent!');

    try {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        const response = await axiosInstance.post('/api/auth/resendOtp', { email: storedEmail });
        if (response.status === 200) {
          toast.success('OTP has been resent');
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
    <div className="min-h-screen flex items-center justify-center background-image">
      <div className="relative border-transparent rounded-lg shadow-lg p-8 w-full max-w-md">
        {!emailSent ? (
          <div className="forgot-password_form">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Forgot Password</h2>
            <img src="/images/forgot-password.jpg" alt="Forgot Password" className="w-full h-auto mb-4" />
            <div className="mb-4 relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                required
              />
              <AiOutlineMail className="absolute top-3 right-3 text-gray-400" />
            </div>
            <button
              onClick={handleSendOTP}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline transition duration-200"
            >
              Send OTP
            </button>
          </div>
        ) : !otpVerified ? (
          <div className="otp-verification_form">
            <img src="/images/otp.webp" alt="OTP Verification" className="w-full h-auto mb-6" />
            <h2 className="text-2xl font-semibold text-center mb-4">Enter OTP</h2>
            <p className="text-center mb-6">Please enter the 6-digit OTP sent to your email.</p>
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
                <button onClick={resendOtp} className="text-blue-500 hover:underline">
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
        ) : (
          <>
           <img src="/images/otp.webp" alt="OTP Verification" className="w-full h-auto mb-6" />
          <ResetPassword email={email} />
          </>
         
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordEmail;

