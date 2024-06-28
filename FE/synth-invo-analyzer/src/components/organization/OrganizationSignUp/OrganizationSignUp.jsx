import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Upload } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, HomeOutlined, IdcardOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import './OrganizationSignUp.css';
import OrgSignupImg from '../../../assets/OrgSignup.svg';
import Header from '../../common/Header/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import firebaseConfig from '../../../config/firebaseConfig/firebaseConfig'; 


initializeApp(firebaseConfig);

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
     
      const response = await axios.post('http://127.0.0.1:8000/auth/organization/signup/', { ...values, logoUrl }, {
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
    <div>
      <Header />
      <div className="signup-container">
        <div className="signup-img">
          <img src={OrgSignupImg} alt="Signup" />
        </div>
        <div className="signup-form">
          <h1>Organization Signup</h1>
          <br />
          <Form
            name="org_signup"
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your Username!',
                },
                {
                  pattern: /^[a-zA-Z0-9]+$/,
                  message: 'Username can only contain letters and numbers!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                style={{ height: '40px' }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your Email!',
                  type: 'email',
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                style={{ height: '40px' }}
              />
            </Form.Item>

            <Form.Item
              name="orgName"
              rules={[
                {
                  required: true,
                  message: 'Please input your Organization Name!',
                },
              ]}
            >
              <Input
                prefix={<HomeOutlined />}
                placeholder="Organization Name"
                style={{ height: '40px' }}
              />
            </Form.Item>

            <Form.Item
              name="address"
              rules={[
                {
                  required: true,
                  message: 'Please input your Address!',
                },
              ]}
            >
              <Input
                prefix={<HomeOutlined />}
                placeholder="Address"
                style={{ height: '40px' }}
              />
            </Form.Item>

            <Form.Item
              name="businessRegNum"
              rules={[
                {
                  required: true,
                  message: 'Please input your Business Registration Number!',
                },
              ]}
            >
              <Input
                prefix={<IdcardOutlined />}
                placeholder="Business Registration Number"
                style={{ height: '40px' }}
              />
            </Form.Item>

            <Form.Item
              name="logo"
        
            >
              <Upload
                listType="picture"
                beforeUpload={() => false} // Prevent automatic upload
                onChange={onLogoChange}
              >
                <Button icon={<UploadOutlined />}>Upload Your Logo</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your Password!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{ height: '40px' }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: 'Please confirm your Password!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{ height: '40px' }}
              />
            </Form.Item>

            <Form.Item
              name="acceptTerms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject('You must accept the terms and conditions!'),
                },
              ]}
            >
              <Checkbox>
                I accept the <a href="/terms">terms and conditions</a>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ height: '40px', backgroundColor: '#6760ef', borderColor: '#6760ef', color: '#fff', width: '100%' }}
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSignUp;
