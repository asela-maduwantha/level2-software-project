import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography, Row, Col } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../common/Header/Header';

const { Title } = Typography;

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [changeError, setChangeError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const user_id = location.state?.supplier_id;

  const onFinish = async (values) => {
    const { new_password, confirm_password } = values;

    if (new_password !== confirm_password) {
      setChangeError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/change-password/', {
        new_password,
        confirm_password,
        user_id,
      });

      if (response.status === 200) {
        navigate('/supplier/signin');
      }
    } catch (error) {
      setChangeError('Failed to change password');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="change-password-body">
        <Row justify="center" align="middle" style={{ minHeight: '100vh', width: '100%' }}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ padding: '20px' }}>
            <div className="change-password-form-container" style={{ maxWidth: '400px', margin: 'auto' }}>
              <Title level={1} className="change-password-title" style={{ textAlign: 'center', color: '#6760EF' }}>
                Change Password
              </Title>

              <Form form={form} name="change_password" onFinish={onFinish} layout="vertical">
                <Form.Item
                  label="New Password"
                  name="new_password"
                  rules={[{ required: true, message: 'Please input your new password!' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="New Password" size="large" />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirm_password"
                  rules={[{ required: true, message: 'Please confirm your new password!' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
                </Form.Item>

                {changeError && (
                  <Alert message={changeError} type="error" showIcon style={{ marginBottom: '10px' }} />
                )}

                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ backgroundColor: '#6760EF', height: '50px' }} block>
                    Change Password
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ChangePassword;
