import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Popconfirm, Table, Input, Select } from 'antd';
import HTTPService from '../../../Service/HTTPService';

const { Option } = Select;

const ModifyModelFeatures = () => {
  const [models, setModels] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [editingFeatureId, setEditingFeatureId] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchModelsData();
  }, []);

  const fetchModelsData = () => {
    HTTPService.get('subscription-models/get_subscription_models/')
      .then(response => setModels(response.data))
      .catch(error => message.error('Error fetching models.'));
  };

  const fetchFeatures = (modelId) => {
    setLoading(true);
    HTTPService.get(`subscription-models/get-features/${modelId}/`)
      .then(response => {
        setFeatures(response.data);
        setSelectedModelId(modelId);
      })
      .catch(error => message.error('Error fetching features.'))
      .finally(() => setLoading(false));
  };

  const handleModifyFeatureSubmit = (featureId) => {
    HTTPService.put(`subscription-models/modify-feature/${featureId}/`, {
      feature: newFeatureName,
      userId : localStorage.getItem('admin_id')
    })
    .then(() => {
      message.success('Feature modified successfully');
      fetchFeatures(selectedModelId);
      setNewFeatureName('');
      setEditingFeatureId(null);
      setVisible(false);
    })
    .catch(() => message.error('Error modifying feature.'));
  };

  const handleRemoveFeature = (featureId) => {
    HTTPService.delete(`subscription-models/remove-feature/${featureId}/`)
    .then(() => {
      message.success('Feature removed successfully');
      fetchFeatures(selectedModelId);
    })
    .catch(() => message.error('Error removing feature.'));
  };

  const columns = [
    {
      title: 'Feature',
      dataIndex: 'feature',
      key: 'feature',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setEditingFeatureId(record.id);
              setVisible(true);
              setNewFeatureName(record.feature);
            }}
            style={{ marginRight: 8 }}
          >
            Change
          </Button>
          <Popconfirm
            title="Are you sure to delete this feature?"
            onConfirm={() => handleRemoveFeature(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Remove</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Select
        placeholder="Select Model"
        style={{ width: 200, marginBottom: 16 }}
        onChange={value => fetchFeatures(value)}
      >
        {models.map(model => (
          <Option key={model.model_id} value={model.model_id}>{model.model_name}</Option>
        ))}
      </Select>
      <Table
        columns={columns}
        dataSource={features}
        rowKey="id"
        pagination={false}
        loading={loading}
      />
      <Modal
        title="Modify Feature"
        visible={visible}
        onOk={() => handleModifyFeatureSubmit(editingFeatureId)}
        onCancel={() => {
          setVisible(false);
          setEditingFeatureId(null);
          setNewFeatureName('');
        }}
      >
        <Input
          placeholder="Enter new feature name"
          value={newFeatureName}
          onChange={e => setNewFeatureName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ModifyModelFeatures;
