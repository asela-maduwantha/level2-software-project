import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, message, Progress } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import HTTPService from '../../../Service/HTTPService';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../common/Header/Header'


const VerifyOtp = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [showResend, setShowResend] = useState(false);

  const email = localStorage.getItem('email');
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};

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
      const response = await HTTPService.post('auth/otp/verify-otp/', {
        email,
        otp: otpCode,
      });
      setIsLoading(false);
      message.success(response.data.message);
      if (state?.fromPricing) {
        navigate('/subscribe', { state: { plan: state.plan } });
      } else {
        navigate('/pricing');
      }
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
      const response = await HTTPService.post('auth/otp/resend-otp/', {
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
    <>
   <Header/>
     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <LockOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '20px' }} />
        <h2 style={{ fontSize: '28px', marginBottom: '30px', color: '#333' }}>Enter OTP</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          {otp.map((value, index) => (
            <Input
              key={index}
              value={value}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              maxLength={1}
              style={{ width: '50px', height: '50px', fontSize: '24px', textAlign: 'center', borderRadius: '8px', border: '1px solid #d9d9d9' }}
              ref={(input) => (otpInputs.current[index] = input)}
            />
          ))}
        </div>
        <Button type="primary" onClick={handleVerifyOtp} loading={isLoading} style={{ width: '100%', height: '50px', fontSize: '18px', marginBottom: '20px', borderRadius: '8px' }}>
          Verify OTP
        </Button>
        {showResend && (
          <Button onClick={handleResendOtp} loading={isLoading} style={{ width: '100%', height: '50px', fontSize: '18px', marginBottom: '20px', borderRadius: '8px' }}>
            Resend OTP
          </Button>
        )}
        <div style={{ marginTop: '20px' }}>
          <Progress percent={Math.round((timer / 60) * 100)} showInfo={false} status={timer > 10 ? 'active' : 'exception'} />
          <p style={{ marginTop: '10px', color: '#666' }}>OTP is valid for: {timer} seconds</p>
        </div>
      </div>
    </div>
    </>
   
  );
};

export default VerifyOtp;
