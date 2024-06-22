import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import axios from 'axios';
import './AdminSignUp.css';
import OrgSignupImg from '../../../assets/OrgSignup.svg';
import Header from '../../common/Header/Header';

const AdminSignUp = () => {
  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/admin/signup/', values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const token = response.data.token
      localStorage.setItem('token' , token)
      localStorage.setItem('admin_id' , response.data.admin_id)
      message.success('Admin signed up successfully!');
    } catch (error) {
      message.error('Failed to sign up organizatAdminion');
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
          <h1>Admin Signup</h1><br />
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

export default AdminSignUp;
