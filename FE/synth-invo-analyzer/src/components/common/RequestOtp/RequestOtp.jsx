import React, { useState } from 'react';
import { Button, Input, message, Spin } from 'antd';
import axios from 'axios';
import HeaderInside from '../HeaderInside/HeaderInside';
import { useNavigate } from 'react-router-dom';

const RequestOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const email = localStorage.getItem('email');
  const hiddenEmail = email ? email.replace(/(.{2})(.*)(@.*)/, '$1****$3') : '';
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/auth/otp/resend-otp/', { email });
      setIsLoading(false);
      message.success(response.data.message);
      navigate('/verify-otp');
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 400) {
        message.error(error.response.data.error);
      } else {
        message.error('Failed to send OTP. Please try again.');
      }
    }
  };

  return (
    <>
      <HeaderInside />
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="/path-to-your-image.jpg" alt="Description" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
        <div style={{ flex: 1, padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2>Verify Your Email</h2>
          <p>Is this your email? {hiddenEmail}</p>
          <Button type="primary" onClick={handleSendOtp} style={{ width: '50%', height: '50px', fontSize: '18px', margin: '0 auto' }}>
            {isLoading ? <Spin /> : 'Send OTP'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default RequestOtp;
