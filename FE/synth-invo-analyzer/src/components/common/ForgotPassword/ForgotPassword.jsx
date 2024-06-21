// src/components/ForgotPassword.js
import React, { useState } from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import axios from 'axios';

const ForgotPassword = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/auth/forgot-password/', { email: values.email });
      message.success('OTP sent to your email.');
      onSuccess(values.email);
    } catch (error) {
      message.error(error.response?.data?.message || 'Error sending OTP.');
    }
    setLoading(false);
  };

  return (
    <Row>
      <Col span={12}>
        <img src="path/to/your/image.jpg" alt="Forgot Password" style={{ width: '100%' }} />
      </Col>
      <Col span={12} style={{ padding: '20px' }}>
        <Form onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
