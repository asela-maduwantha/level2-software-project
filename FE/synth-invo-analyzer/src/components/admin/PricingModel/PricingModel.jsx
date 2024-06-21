import React from 'react';
import { Form, Input, Select, Button, Card, Space, notification } from 'antd';
import axios from 'axios';

const { Option } = Select;

function PricingModel() {
  const [form] = Form.useForm();

  // This function displays notifications
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
      const response = await axios.post('http://127.0.0.1:8000/subscription-models/create_subscription/', {
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

      openNotificationWithIcon(
        'success',
        'Success!',
        'The product was created successfully.'
      );
      form.resetFields();
    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please try again later.';


      openNotificationWithIcon('error', 'Error', errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <Form
          form={form}
          onFinish={handleCreateProduct}
          layout="vertical"
        >
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a product name!' }]}
          >
            <Input placeholder="Enter the product name" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: 'Please enter a price!' },
              {
                pattern: /^[0-9]+$/, // Validates only whole numbers
                message: 'Price must be a non-negative integer.',
              },
            ]}
          >
            <Input placeholder="Enter the price" />
          </Form.Item>

          <Form.Item
            label="Currency"
            name="currency"
            rules={[{ required: true, message: 'Please select a currency!' }]}
          >
            <Select>
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
            <Select>
              <Option value="week">Weekly</Option>
              <Option value="month">Monthly</Option>
              <Option value="year">Yearly</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Model
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default PricingModel;
