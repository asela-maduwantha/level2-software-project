import React, { useState } from 'react';
import { Button, message, Spin } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import HTTPService from '../../../Service/HTTPService';
import { useNavigate } from 'react-router-dom';

const RequestOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const email = localStorage.getItem('email');
  const hiddenEmail = email ? email.replace(/(.{2})(.*)(@.*)/, '$1****$3') : '';
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await HTTPService.post('auth/otp/resend-otp/', { email });
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 64px)' // Adjust based on your header height
      }}>
        <div style={{ 
          display: 'flex', 
          width: '80%', 
          maxWidth: '1200px', 
          backgroundColor: 'white', 
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            flex: 1, 
            backgroundImage: 'url("/path-to-your-image.jpg")', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }} />
          <div style={{ 
            flex: 1, 
            padding: '50px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <MailOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '20px' }} />
            <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>Verify Your Email</h2>
            <p style={{ fontSize: '16px', marginBottom: '30px', color: '#666' }}>
              Is this your email? <strong>{hiddenEmail}</strong>
            </p>
            <Button 
              type="primary" 
              onClick={handleSendOtp} 
              loading={isLoading}
              style={{ 
                width: '200px', 
                height: '50px', 
                fontSize: '18px', 
                borderRadius: '25px'
              }}
            >
              Send OTP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestOtp;