import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography, Row, Col, Divider } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { GoogleLogin } from '@react-oauth/google';
import HTTPService from '../../../Service/HTTPService';
import { useNavigate } from 'react-router-dom';
import './SupplierSignIn.css';
import Header from '../../common/Header/Header';
import SupplierSignInImg from '../../../assets/SupplierSignIn.svg';

const { Title, Text } = Typography;

const SupplierSignIn = () => {
  const [form] = Form.useForm();
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (_, value) => {
    const isValidEmail = /\S+@\S+\.\S+/.test(value);
    if (isValidEmail) {
      setLoginError('');
      return Promise.resolve();
    } else {
      setLoginError('Please enter a valid email address');
      return Promise.reject(new Error('Please enter a valid email address'));
    }
  };

  const onFinish = async (values) => {
    const { email, password } = values;

    try {
      const response = await HTTPService.post("auth/supplier/signin/", {
        email,
        password,
      });

      if (response.status === 200) {
        const { access, refresh, supplier_id } = response.data;
        localStorage.setItem('token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('supplier_id', supplier_id);
        localStorage.setItem('email', email);
        navigate('/supplier/dashboard');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 307) {
          const { supplier, token } = error.response.data;
          localStorage.setItem('token', token);
          navigate('/change-password', { state: { supplier_id: supplier } });
        } else {
          setLoginError('Invalid email or password');
        }
      } else {
        setLoginError('Cannot connect to the server');
      }
    }
  };

  return (
    <>
      <Header />
      <div className="signin-body">
        <Row justify="center" align="middle" style={{ minHeight: '100vh', width: '100%' }}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ padding: 0 }}>
            <div className="signin-image" style={{ height: '100%' }}>
              <img src={SupplierSignInImg} alt="Supplier Sign In" />
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ padding: '20px' }}>
            <div className="signin-form-container" style={{ maxWidth: '400px', margin: 'auto' }}>
              <Title level={1} className="signin-title" style={{ textAlign: 'center', color: '#6760EF' }}>
                Supplier Sign In
              </Title>

              <Form form={form} name="signin" onFinish={onFinish} layout="vertical">
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Email is required' },
                    { validator: validateEmail },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Password is required' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                </Form.Item>

                {loginError && (
                  <Alert message={loginError} type="error" showIcon style={{ marginBottom: '10px' }} />
                )}

                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ backgroundColor: '#6760EF', height: '50px' }} block>
                    Sign In
                  </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                  <a href="/forgot-password" style={{ color: '#6760EF' }}>
                    Forgot password?
                  </a>
                </div>
              </Form>

              <Divider>or connect with</Divider>

              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log('Google Login Successful:', credentialResponse);
                }}
                onError={() => {
                  console.log('Google Login Failed');
                }}
              />

              <Divider />

              <div style={{ textAlign: 'center' }}>
                <Text>
                  Don't have an account?{' '}
                  <a href="/supplier/signup" style={{ color: '#6760EF' }}>
                    Sign Up
                  </a>
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SupplierSignIn;
