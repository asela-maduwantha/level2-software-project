import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Upload, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, HomeOutlined, IdcardOutlined, UploadOutlined } from '@ant-design/icons';
import HTTPService from '../../../Service/HTTPService';
import styled from 'styled-components';
import OrgSignupImg from '../../../assets/OrgSignup.svg';
import Header from '../../common/Header/Header';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import firebaseConfig from '../../../config/firebaseConfig/firebaseConfig'; 

initializeApp(firebaseConfig);

const { Title } = Typography;

const SignupContainer = styled.div`
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const SignupContent = styled.div`
  display: flex;
  min-height: calc(100vh - 100px);
  padding: 2rem;
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

const SignupImage = styled.img`
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
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 1rem;
  }

  .ant-input-affix-wrapper {
    padding: 0.5rem 1rem;
  }

  .ant-row {
    margin-bottom: 1rem;
  }
`;

const SignupButton = styled(Button)`
  height: 48px;
  font-size: 16px;
  background-color: #6760ef;
  border-color: #6760ef;

  &:hover, &:focus {
    background-color: #5949d6;
    border-color: #5949d6;
  }
`;

const OrganizationSignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};
  const [logoFile, setLogoFile] = useState(null);

  const onLogoChange = (info) => {
    setLogoFile(info.file);
  };

  const uploadLogoToFirebase = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `logos/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }
    try {
      let logoUrl = '';
      if (logoFile) {
        logoUrl = await uploadLogoToFirebase(logoFile);
      }
     
      const response = await HTTPService.post('auth/organization/signup/', { ...values, logoUrl }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      message.success('Organization signed up successfully!');
      localStorage.setItem('email', values.email);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('organization_id', response.data.organization_id);
      navigate('/verify-otp', { state: { fromPricing: state?.fromPricing, plan: state?.plan } });
    } catch (error) {
      message.error('Failed to sign up organization');
    }
  };

  return (
    <SignupContainer>
      <Header />
      <SignupContent>
        <ImageContainer>
          <SignupImage src={OrgSignupImg} alt="Organization Sign Up" />
        </ImageContainer>
        <FormContainer>
          <FormWrapper>
            <Title level={2} style={{ color: '#6760ef', marginBottom: '2rem' }}>Let's Start Analysing</Title>
            
            <StyledForm name="org_signup" onFinish={onFinish} layout="vertical" initialValues={{ remember: true }}>
              <Form.Item>
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: 'Please input your Username!' },
                    { pattern: /^[a-zA-Z0-9]+$/, message: 'Username can only contain letters and numbers!' },
                  ]}
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" style={{ height: '40px' }} />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your Email!', type: 'email' },
                  ]}
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: '16px' }}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" style={{ height: '40px' }} />
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Form.Item
                  name="orgName"
                  rules={[{ required: true, message: 'Please input your Organization Name!' }]}
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <Input prefix={<HomeOutlined />} placeholder="Organization Name" style={{ height: '40px' }} />
                </Form.Item>
                <Form.Item
                  name="address"
                  rules={[{ required: true, message: 'Please input your Address!' }]}
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: '16px' }}
                >
                  <Input prefix={<HomeOutlined />} placeholder="Address" style={{ height: '40px' }} />
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Form.Item
                  name="businessRegNum"
                  rules={[{ required: true, message: 'Please input your Business Registration Number!' }]}
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <Input prefix={<IdcardOutlined />} placeholder="Business Registration Number" style={{ height: '40px' }} />
                </Form.Item>
                <Form.Item
                  name="logo"
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: '16px' }}
                >
                  <Upload listType="picture" beforeUpload={() => false} onChange={onLogoChange}>
                    <Button icon={<UploadOutlined />} style={{ width: '100%' }}>Upload Your Logo</Button>
                  </Upload>
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your Password!' }]}
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />} style={{ height: '40px' }} />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  rules={[{ required: true, message: 'Please confirm your Password!' }]}
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: '16px' }}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />} style={{ height: '40px' }} />
                </Form.Item>
              </Form.Item>

              <Form.Item name="acceptTerms" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('You must accept the terms and conditions!') }]}>
                <Checkbox>I accept the <a href="/terms">terms and conditions</a></Checkbox>
              </Form.Item>

              <Form.Item>
                <SignupButton type="primary" htmlType="submit" block>
                  Sign Up
                </SignupButton>
              </Form.Item>
              
              <Form.Item>
                <Link to="/organization/signin">Already have an account? Sign in here</Link>
              </Form.Item>
            </StyledForm>
          </FormWrapper>
        </FormContainer>
      </SignupContent>
    </SignupContainer>
  );
};

export default OrganizationSignUp;
