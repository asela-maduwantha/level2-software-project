import React, { useState } from 'react';
import HTTPService from '../../../Service/HTTPService';
import { Form, Input, Button, message, Row, Col, Typography, Card, Space } from 'antd';
import { MailOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import AddSupImg from '../../../assets/addsupplier.svg';
import './AddSupplier.css';

const { Title } = Typography;

const AddSupplier = () => {
  const [form] = Form.useForm();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const orgId = localStorage.getItem('organization_id');

  const handleEmailChange = async (e) => {
    const email = e.target.value;
    if (email) {
      try {
        setLoading(true);
        const response = await HTTPService.get(`auth/supplier/check/?email=${email}`);
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
        message.error('Failed to check supplier information');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddSupplier = async (values) => {
    try {
      setLoading(true);
      const data = { ...values, organization_id: orgId };
      const response = await HTTPService.post('auth/supplier/add/', data);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-supplier-container">
      <Row gutter={32} align="middle" justify="center" style={{ minHeight: '80vh' }}>
        <Col xs={24} md={12}>
          <img
            src={AddSupImg}
            alt="Add Supplier"
            style={{ width: '100%', maxWidth: '500px', height: 'auto', display: 'block', margin: 'auto' }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Card className="add-supplier-card" bordered={false}>
            <Title level={2} className="add-supplier-title">Add Your Suppliers</Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddSupplier}
              className="add-supplier-form"
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter supplier email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Supplier Email"
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    onChange={handleEmailChange}
                    className="custom-input"
                  />
                </Form.Item>
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: 'Please enter supplier name' }]}
                >
                  <Input
                    size="large"
                    placeholder="Supplier Name"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    disabled={isRegistered}
                    className="custom-input"
                  />
                </Form.Item>
                <Form.Item
                  name="address"
                  rules={[{ required: true, message: 'Please enter supplier address' }]}
                >
                  <Input
                    size="large"
                    placeholder="Supplier Address"
                    prefix={<HomeOutlined className="site-form-item-icon" />}
                    disabled={isRegistered}
                    className="custom-input"
                  />
                </Form.Item>
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    className="custom-button"
                    loading={loading}
                    block
                    size="large"
                  >
                    Add Supplier
                  </Button>
                </Form.Item>
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddSupplier;