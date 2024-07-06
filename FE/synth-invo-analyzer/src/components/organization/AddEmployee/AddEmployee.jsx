import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Card, message, Typography } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import HTTPService from '../../../Service/HTTPService';
import './AddEmployee.css';
//import employeeImage from './assets/employee_image.png'; // Import the local image

const { Title } = Typography;

const AddEmployee = () => {
  const orgId = localStorage.getItem('organization_id');

  const onFinish = async (values) => {
    try {
      const response = await HTTPService.post('auth/employee/add/', {
        user: {
          username: values.username,
          email: values.email,
        },
        organization: orgId,
      });
      console.log('Response:', response.data);
      message.success('Employee added successfully!');
      
    } catch (err) {
      console.error('Error:', err.response ? err.response.data : err.message);
      message.error(err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="add-employee-container" style={{paddingTop:'5%', paddingLeft:'4%'}}>
      <Row gutter={16} justify="center">
        <Col span={12}>
          <Card
            cover={
              <img
                alt="Employee"
                src=""
              />
            }
          />
        </Col>
        <Col span={12}>
          <Title level={2} style={{ textAlign: 'center' , width:'80%'}}>Add New Employee</Title>
          <Form
            name="add_employee"
            className="add-employee-form"
            onFinish={onFinish}
            layout="vertical"
            style={{ width: '80%' }} // Set form width to 100% of its container
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input the username!' }]}
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
                { required: true, message: 'Please input the email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                style={{ height: '40px' }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ height: '40px', width: '100%' }}>
                Add Employee
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default AddEmployee;
