import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography, Row, Col, Divider } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import HTTPService from '../../../Service/HTTPService';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../../common/Header/Header';
import SupplierSignInImg from '../../../assets/Supplier.svg';

const { Title, Text } = Typography;

const SignInContainer = styled.div`
  min-height: 100vh;
  background-color: #fffff;
`;

const SignInContent = styled.div`
  display: flex;
  min-height: calc(100vh - 64px); /* Adjust based on your header height */
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SignInImage = styled.img`
  max-width: 80%;
  height: auto;
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const StyledForm = styled(Form)`
  background-color: #ffffff;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const SignInButton = styled(Button)`
  height: 48px;
  font-size: 16px;
  background-color: #1890ff;
  border-color: #1890ff;

  &:hover,
  &:focus {
    background-color: #40a9ff;
    border-color: #40a9ff;
  }
`;

const FormFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;

  a {
    color: #1890ff;
    margin-top: 0.5rem;
  }
`;

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
      const response = await HTTPService.post('auth/supplier/signin/', {
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
    <SignInContainer>
      <Header />
      <SignInContent>
        <ImageContainer>
          <SignInImage src={SupplierSignInImg} alt="Supplier Sign In" />
        </ImageContainer>
        <FormContainer>
          <StyledForm form={form} name="signin" onFinish={onFinish} layout="vertical">
            <Title level={2} style={{ color: '#1890ff', marginBottom: '0.5rem', textAlign: 'center' }}>
              Supplier Sign In
            </Title>
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
            {loginError && <Alert message={loginError} type="error" showIcon style={{ marginBottom: '1rem' }} />}
            <Form.Item>
              <SignInButton type="primary" htmlType="submit" block size="large">
                Sign In
              </SignInButton>
            </Form.Item>
            <FormFooter>
              <a href="/forgot-password">Forgot password?</a>
              <Text>
                Don't have an account? <a href="/supplier/signup">Sign Up</a>
              </Text>
            </FormFooter>
          </StyledForm>
        </FormContainer>
      </SignInContent>
    </SignInContainer>
  );
};

export default SupplierSignIn;
