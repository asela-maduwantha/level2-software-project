import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const UpdatePricingModels = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/subscription-models/get_subscription_models/')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        message.error('Error fetching data.');
      });
  }, []);

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
    axios
      .put('http://127.0.0.1:8000/subscription-models/update-price/', {
        admin_id : localStorage.getItem('admin_id'),
        product_id: editingModel.stripe_id,
        model_name: values.model_name,
        new_price: values.new_price,
        currency: values.currency,
        interval: values.interval,
      })
      .then(() => {
        message.success('Model updated successfully!');
        setIsModalVisible(false);
        setData((prevData) =>
          prevData.map((item) =>
            item.stripe_id === editingModel.stripe_id
              ? { ...item, model_name: values.model_name, model_price: values.new_price }
              : item
          )
        );
      })
      .catch((error) => {
        console.error('Error updating model:', error);
        message.error('Error updating model.');
      });
  };

  const columns = [
    {
      title: 'Model Name',
      dataIndex: 'model_name',
      key: 'model_name',
    },
    {
      title: 'Price ($)',
      dataIndex: 'model_price',
      key: 'model_price',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button type="primary" onClick={() => showEditModal(record)}>
          Update Model
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={data} columns={columns} rowKey="model_id" />
      <Modal
        title="Update Model"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleUpdate}>
          <Form.Item
            name="model_name"
            label="Model Name"
            rules={[{ required: true, message: 'Please enter the model name.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="new_price"
            label="New Price"
            rules={[{ required: true, message: 'Please enter the new price.' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="currency"
            label="Currency"
            initialValue="usd"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="interval"
            label="Billing Interval"
            initialValue="month"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdatePricingModels;
