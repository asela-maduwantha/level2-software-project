import React from 'react';
import { Form, Input, Select, Button, Card, Space, notification, Typography } from 'antd';
import { DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import HTTPService from '../../../Service/HTTPService';

const { Option } = Select;
const { Title } = Typography;

function PricingModel() {
  const [form] = Form.useForm();

  const openNotificationWithIcon = (type, message, description = '') => {
    notification[type]({
      message: message,
      description: description,
      placement: 'topRight',
      duration: 3,
    });
  };

  const handleCreateProduct = async (values) => {
    const { name, price, billingPeriod, currency } = values;

    try {
      const token = localStorage.getItem('token');
      const response = await HTTPService.post('subscription-models/create_subscription/', {
        model_name: name,
        unit_amount: parseFloat(price),
        interval: billingPeriod,
        currency,
        admin_id: localStorage.getItem('admin_id') 
      }, {
        headers: {
          'Authorization': `${token}`
        }
      });

      openNotificationWithIcon('success', 'Success!', 'The subscription model was created successfully.');
      form.resetFields();
    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      openNotificationWithIcon('error', 'Error', errorMessage);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f0f2f5', 
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: '500px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px'
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          Create Subscription Model
        </Title>
        <Form
          form={form}
          onFinish={handleCreateProduct}
          layout="vertical"
        >
          <Form.Item
            label="Subscription Model Name"
            name="name"
            rules={[{ required: true, message: 'Please select a subscription model name!' }]}
          >
            <Select placeholder="Select the subscription model">
              <Option value="Free">Free</Option>
              <Option value="Basic">Basic</Option>
              <Option value="Standard">Standard</Option>
              <Option value="Premium">Premium</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: 'Please enter a price!' },
              {
                pattern: /^[0-9]+$/,
                message: 'Price must be a non-negative integer.',
              },
            ]}
          >
            <Input 
              prefix={<DollarOutlined />} 
              placeholder="Enter the price" 
            />
          </Form.Item>

          <Form.Item
            label="Currency"
            name="currency"
            rules={[{ required: true, message: 'Please select a currency!' }]}
          >
            <Select placeholder="Select currency">
              <Option value="usd">USD</Option>
              <Option value="mkd">MKD</Option>
              <Option value="mdl">MDL</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Billing Period"
            name="billingPeriod"
            rules={[{ required: true, message: 'Please select a billing period!' }]}
          >
            <Select 
              placeholder="Select billing period"
              suffixIcon={<CalendarOutlined />}
            >
              <Option value="week">Weekly</Option>
              <Option value="month">Monthly</Option>
              <Option value="year">Yearly</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              size="large"
              block
            >
              Create Model
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default PricingModel;