// src/components/ForgotPassword.js
import React, { useState } from 'react';
import { Form, Input, Button, message, Row, Col, Typography } from 'antd';
import HTTPService from '../../../Service/HTTPService';
import forgotImg from '../../../assets/Forgot-password.svg';
import Header from '../HeaderInside/HeaderInside';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      localStorage.setItem('email', values.email);
      await HTTPService.post('auth/forgot-password/', { email: values.email });
      message.success('OTP sent to your email.');
      navigate('/forgot-password-otp-verify');
    } catch (error) {
      message.error(error.response?.data?.message || 'Error sending OTP.');
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <Row style={{ height: '90vh' }}>
        <Col span={12}>
          <img src={forgotImg} alt="Forgot Password" style={{ width: '100%' }} />
        </Col>
        <Col span={6} style={{ padding: '20px', paddingTop: '100px' }}>
          <Title level={1}>Enter your e-mail</Title>
          <br />
          <Form onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
            >
              <Input placeholder="Email" style={{ height: '40px', fontSize: '16px' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} style={{ height: '40px', fontSize: '16px' }}>
                Request OTP
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default ForgotPassword;
