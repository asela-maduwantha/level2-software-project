import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Input, message, Row, Col, Typography, Select, Layout } from 'antd';
import { EditOutlined, DollarOutlined, GlobalOutlined, CalendarOutlined } from '@ant-design/icons';
import HTTPService from '../../../Service/HTTPService';

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const UpdatePricingModels = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    HTTPService
      .get('subscription-models/get_subscription_models/')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        message.error('Error fetching data.');
      });
  };

  const showEditModal = (model) => {
    setEditingModel(model);
    form.setFieldsValue({
      model_name: model.model_name,
      new_price: model.model_price,
      currency: 'usd',
      interval: 'month',
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdate = (values) => {
    HTTPService
      .put('subscription-models/update-subscription-model/', {
        admin_id: localStorage.getItem('admin_id'),
        product_id: editingModel.stripe_id,
        model_name: values.model_name,
        new_price: values.new_price,
        currency: values.currency,
        interval: values.interval,
      })
      .then(() => {
        message.success('Model updated successfully!');
        setIsModalVisible(false);
        fetchData(); // Refresh data after update
      })
      .catch((error) => {
        console.error('Error updating model:', error);
        message.error('Error updating model.');
      });
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Content style={{ padding: '50px' }}>
        <Title level={2} style={{ marginBottom: '30px', textAlign: 'center' }}>
          Update Pricing Models
        </Title>
        <Row gutter={[16, 16]}>
          {data.map((model) => (
            <Col xs={24} sm={12} md={8} lg={6} key={model.model_id}>
              <Card
                hoverable
                style={{ height: '100%' }}
                actions={[
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    onClick={() => showEditModal(model)}
                  >
                    Update
                  </Button>
                ]}
              >
                <Card.Meta
                  title={<Title level={4}>{model.model_name}</Title>}
                  description={
                    <>
                      <p><DollarOutlined /> Price: ${model.model_price}</p>
                      <p><GlobalOutlined /> Currency: USD</p>
                      <p><CalendarOutlined /> Billing: Monthly</p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
        <Modal
          title="Update Pricing Model"
          visible={isModalVisible}
          onCancel={handleCancel}
          onOk={() => form.submit()}
          okText="Update"
          cancelText="Cancel"
        >
          <Form form={form} onFinish={handleUpdate} layout="vertical">
            <Form.Item
              name="model_name"
              label="Model Name"
              rules={[{ required: true, message: 'Please enter the model name.' }]}
            >
              <Input prefix={<EditOutlined />} />
            </Form.Item>
            <Form.Item
              name="new_price"
              label="New Price"
              rules={[{ required: true, message: 'Please enter the new price.' }]}
            >
              <Input prefix={<DollarOutlined />} type="number" />
            </Form.Item>
            <Form.Item
              name="currency"
              label="Currency"
              initialValue="usd"
            >
              <Select>
                <Option value="usd">USD</Option>
                <Option value="eur">EUR</Option>
                <Option value="gbp">GBP</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="interval"
              label="Billing Interval"
              initialValue="month"
            >
              <Select>
                <Option value="month">Monthly</Option>
                <Option value="year">Yearly</Option>
                <Option value="week">Weekly</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default UpdatePricingModels;