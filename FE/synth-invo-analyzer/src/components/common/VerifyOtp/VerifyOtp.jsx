import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, message, Spin } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [showResend, setShowResend] = useState(false); 
  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  const otpInputs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      setShowResend(true); 
      message.error('OTP expired. Please request a new OTP.');
    }
  }, [timer]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < otp.length - 1) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (event, index) => {
    if (event.key === 'Backspace' && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      const otpCode = otp.join('');
      const response = await axios.post('http://127.0.0.1:8000/auth/otp/verify-otp/', {
        email,
        otp: otpCode,
      });
      setIsLoading(false);
      message.success(response.data.message);
      localStorage.removeItem('email');
      navigate('/organization/dashboard')
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 400) {
        message.error(error.response.data.error);
      } else {
        message.error('Failed to verify OTP. Please try again.');
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/auth/otp/resend-otp/', {
        email,
      });
      setIsLoading(false);
      message.success(response.data.message);
      setTimer(60); 
      setShowResend(false); 
    } catch (error) {
      setIsLoading(false);
      message.error('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ padding: '20px', maxWidth: '400px', width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: '10px' }}>
        <h2>Enter OTP</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {otp.map((value, index) => (
            <Input
              key={index}
              value={value}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              maxLength={1}
              style={{ width: '50px', height: '50px', fontSize: '24px', textAlign: 'center' }}
              ref={(input) => (otpInputs.current[index] = input)}
            />
          ))}
        </div>
        <Button type="primary" onClick={handleVerifyOtp} style={{ width: '100%', height: '50px', fontSize: '18px', marginTop: '20px' }}>
          {isLoading ? <Spin /> : 'Verify OTP'}
        </Button>
        {showResend && (
          <Button onClick={handleResendOtp} style={{ width: '100%', height: '50px', fontSize: '18px', marginTop: '20px' }}>
            {isLoading ? <Spin /> : 'Resend OTP'}
          </Button>
        )}
        <div style={{ marginTop: '10px' }}>
          <p>OTP is valid for: {timer} seconds</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
