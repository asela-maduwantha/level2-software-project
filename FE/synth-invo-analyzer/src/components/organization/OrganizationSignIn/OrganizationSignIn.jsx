import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import HTTPService from '../../../Service/HTTPService';
import Header from '../../common/Header/Header';
import { useNavigate } from 'react-router-dom';
import OrgSignupImg from '../../../assets/OrgSignup.svg';

const { Title, Text } = Typography;

const SigninContainer = styled.div`
  min-height: 100vh;
  background-color: #FFFFF;
`;

const SigninContent = styled.div`
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

const SigninImage = styled.img`
  max-width: 90%;
  height: auto;
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const FormWrapper = styled.div`
  background-color: #ffffff;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 1.5rem;
  }

  .ant-input-affix-wrapper {
    padding: 0.5rem 1rem;
  }
`;

const SigninButton = styled(Button)`
  height: 48px;
  font-size: 16px;
  background-color: #fffff;
  border-color: #1890ff;

  &:hover, &:focus {
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
    <SigninContainer>
      <Header />
      <SigninContent>
        <ImageContainer>
          <SigninImage src={OrgSignupImg} alt="Organization Sign In" />
        </ImageContainer>
        <FormContainer>
          <FormWrapper>
            <Title level={2} style={{ color: '#1890ff', marginBottom: '0.5rem' }}>Welcome Back</Title>
            <Text style={{ display: 'block', color: '#8c8c8c', marginBottom: '2rem' }}>Sign in to your organization account</Text>

            <StyledForm form={form} name="signin" onFinish={onFinish} layout="vertical">
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { validator: validateEmail },
                ]}
              >
                <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" size="large" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" size="large" />
              </Form.Item>

              {loginError && (
                <Alert message={loginError} type="error" showIcon style={{ marginBottom: '1rem' }} />
              )}

              <Form.Item>
                <SigninButton type="primary" htmlType="submit" block size="large">
                  Sign In
                </SigninButton>
              </Form.Item>

              <FormFooter>
                <a href="/forgot-password">
                  Forgot password?
                </a>
                <Text>
                  Don't have an account? <a href="/organization/signup">Sign Up</a>
                </Text>
              </FormFooter>
            </StyledForm>
          </FormWrapper>
        </FormContainer>
      </SigninContent>
    </SigninContainer>
  );
};

export default OrganizationSignIn;
