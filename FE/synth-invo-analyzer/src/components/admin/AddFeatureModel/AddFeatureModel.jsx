// AddFeatureModel.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Table, message } from 'antd';
import axios from 'axios';

const AddFeatureModel = () => {
  const [visible, setVisible] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [feature, setFeature] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = () => {
    axios.get('http://127.0.0.1:8000/subscription-models/get_subscription_models/')
      .then(response => {
        setModels(response.data);
      })
      .catch(error => {
        console.error('Error fetching models:', error);
        message.error('Error fetching models. Please try again later.');
      });
  };

  const handleAddFeature = (modelId) => {
    setSelectedModel(modelId);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setError(''); // Clear any previous errors when closing the modal
  };

  const handleAddFeatureSubmit = () => {
    const userId = localStorage.getItem('user_id');
    axios.post('http://127.0.0.1:8000/subscription-models/create-feature/', {
      created_by: userId,
      model: selectedModel,
      feature: feature
    })
    .then(response => {
      console.log('Feature added successfully:', response.data);
      message.success('Feature added successfully');
      setVisible(false);
      setError('');
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
    },
    {
      title: 'Billing Period',
      dataIndex: 'billing_period',
      key: 'billing_period',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button type="primary" onClick={() => handleAddFeature(record.model_id)}>
          Add Feature
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={models}
        rowKey="model_id"
        pagination={false}
      />
      <Modal
        title="Add Feature"
        visible={visible}
        onCancel={handleCancel}
        onOk={handleAddFeatureSubmit}
      >
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <Input
          placeholder="Enter feature"
          value={feature}
          onChange={e => setFeature(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default AddFeatureModel;
