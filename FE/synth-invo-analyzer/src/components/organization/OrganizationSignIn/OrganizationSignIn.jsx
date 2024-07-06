import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography, Row, Col , Divider} from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { GoogleLogin } from '@react-oauth/google';
import HTTPService from '../../../Service/HTTPService';
import Header from '../../common/Header/Header';
import { useNavigate } from 'react-router-dom';
import './OrganizationSignIn.css';
import OrgSignupImg from '../../../assets/OrgSignup.svg'

const { Title, Text } = Typography;

const OrganizationSignIn = () => {
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
      return Promise.reject(new Error(''));
    }
  };

  const onFinish = async (values) => {
    const { email, password } = values;

    try {
      const response = await HTTPService.post("auth/organization/signin/", {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data.access;
        localStorage.setItem('token', token);
        localStorage.setItem('organization_id', response.data.organization_id);
        navigate('/organization/dashboard');
      }
      if (response.status === 203) {
        localStorage.setItem("email", response.data.email);
        navigate('/verify-email');
      }

    } catch (error) {
      setLoginError('Invalid email or password');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Header/>
      <div className="signin-body">
        <Row justify="center" align="middle" style={{ minHeight: '100vh' , width:'100%'}}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ padding: 0 }}>
            <div className="signin-image" style={{ height: '100%'}}>
             <img src={OrgSignupImg}></img>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ padding: '20px' }}>
            <div className="signin-form-container" style={{ maxWidth: '400px', margin: 'auto' }}>
              <Title level={1} className="signin-title" style={{ textAlign: 'center', color: '#6760EF' }}>
                Organization Sign In
              </Title>

              <Form form={form} name="signin" onFinish={onFinish} layout="vertical">
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: '' },
                    { validator: validateEmail },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: '' }]}
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
                  <a href="/organization/signup" style={{ color: '#6760EF' }}>
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

export default OrganizationSignIn;
