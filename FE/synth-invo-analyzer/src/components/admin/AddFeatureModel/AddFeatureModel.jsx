import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Table, message, Typography, Layout, Space, Card } from 'antd';
import { PlusOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import HTTPService from '../../../Service/HTTPService';

const { Title } = Typography;
const { Content } = Layout;

const AddFeatureModel = () => {
  const [visible, setVisible] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [feature, setFeature] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = () => {
    setLoading(true);
    HTTPService.get('subscription-models/get_subscription_models/')
      .then(response => {
        setModels(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching models:', error);
        message.error('Error fetching models. Please try again later.');
        setLoading(false);
      });
  };

  const handleAddFeature = (modelId) => {
    setSelectedModel(modelId);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setError('');
    setFeature('');
  };

  const handleAddFeatureSubmit = () => {
    if (!feature.trim()) {
      setError('Please enter a feature.');
      return;
    }

    const userId = localStorage.getItem('admin_id');
    HTTPService.post('subscription-models/create-feature/', {
      created_by: userId,
      model: selectedModel,
      feature: feature.trim()
    })
    .then(response => {
      console.log('Feature added successfully:', response.data);
      message.success('Feature added successfully');
      setVisible(false);
      setError('');
      setFeature('');
      fetchModels(); // Refresh the models list
    })
    .catch(error => {
      console.error('Error adding feature:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Error adding feature. Please try again later.');
      }
    });
  };

  const columns = [
    {
      title: 'Model Name',
      dataIndex: 'model_name',
      key: 'model_name',
    },
    {
      title: 'Model Price',
      dataIndex: 'model_price',
      key: 'model_price',
      render: (price) => (
        <Space>
          <DollarOutlined />
          {price}
        </Space>
      ),
    },
    {
      title: 'Billing Period',
      dataIndex: 'billing_period',
      key: 'billing_period',
      render: (period) => (
        <Space>
          <CalendarOutlined />
          {period}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => handleAddFeature(record.model_id)}
        >
          Add Feature
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Content style={{ padding: '50px' }}>
        <Card>
          <Title level={2} style={{ marginBottom: '30px' }}>
            Subscription Models and Features
          </Title>
          <Table
            columns={columns}
            dataSource={models}
            rowKey="model_id"
            pagination={false}
            loading={loading}
          />
        </Card>
        <Modal
          title="Add Feature"
          visible={visible}
          onCancel={handleCancel}
          onOk={handleAddFeatureSubmit}
          okText="Add Feature"
          cancelText="Cancel"
        >
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          <Input
            placeholder="Enter feature"
            value={feature}
            onChange={e => setFeature(e.target.value)}
            onPressEnter={handleAddFeatureSubmit}
            prefix={<PlusOutlined />}
          />
        </Modal>
      </Content>
    </Layout>
  );
};

export default AddFeatureModel;