import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { MailOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import AddSupImg from '../../../assets/addsupplier.svg'
import './AddSupplier.css'; 


const AddSupplier = ({ organizationId }) => {
  const [form] = Form.useForm();
  const [isRegistered, setIsRegistered] = useState(false);
  const orgId = localStorage.getItem('organization_id')

  const handleEmailChange = async (e) => {
    const email = e.target.value;

    if (email) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/auth/supplier/check/?email=${email}`);
        if (response.data.exists) {
          form.setFieldsValue({
            name: response.data.name,
            address: response.data.address,
          });
          setIsRegistered(true);
        } else {
          form.resetFields(['name', 'address']);
          setIsRegistered(false);
        }
      } catch (error) {
        console.error('Error checking supplier:', error);
      }
    }
  };

  const handleAddSupplier = async (values) => {
    try {
      const data = { ...values, organization_id: orgId };
      const response = await axios.post('http://127.0.0.1:8000/auth/supplier/add/', data);
      message.success(response.data.message);
      form.resetFields();
      setIsRegistered(false);
    } catch (error) {
      console.error('Error adding supplier request:', error);
      if (error.response && error.response.status === 409) {
        message.error("You have already requested this supplier");
      } else {
        message.error('Failed to add supplier request.');
      }
    }
  };
  

  return (
    <div className="add-supplier-container">
      <Row gutter={16} align="middle" style={{ minHeight: '70vh' }}>
        <Col xs={24} md={12}>
          <img
            src={AddSupImg} 
            alt="Supplier"
            style={{ width: '100%', height: 'auto' }}
          />
        </Col>
        <Col xs={24} md={12}>
        
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddSupplier}
            className="add-supplier-form"
          >
            <h1>Add Your Suppliers</h1><br></br>
            <Form.Item
              label="Supplier Email"
              name="email"
              rules={[{ required: true, message: 'Please enter supplier email' }]}
            >
              <Input
                type="email"
                placeholder="Enter supplier email"
                prefix={<MailOutlined />}
                onChange={handleEmailChange}
                className="custom-input"
              />
            </Form.Item>
            <Form.Item
              label="Supplier Name"
              name="name"
              rules={[{ required: true, message: 'Please enter supplier name' }]}
            >
              <Input
                placeholder="Enter supplier name"
                prefix={<UserOutlined />}
                disabled={isRegistered}
                className="custom-input"
              />
            </Form.Item>
            <Form.Item
              label="Supplier Address"
              name="address"
              rules={[{ required: true, message: 'Please enter supplier address' }]}
            >
              <Input
                placeholder="Enter supplier address"
                prefix={<HomeOutlined />}
                disabled={isRegistered}
                className="custom-input"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="custom-button">
                Add Supplier
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default AddSupplier;
