import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Modal, message, Typography, Space, Tooltip } from 'antd';
import { EditOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons';
import HTTPService from '../../../Service/HTTPService';
import './AccountSettings.css'; 

const { Title, Text } = Typography;

const AccountSettings = () => {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState(null);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const organizationId = localStorage.getItem('organization_id');
    try {
      const response = await HTTPService.get(`auth/organization/profile/${organizationId}`);
      setProfile(response.data);
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error('Failed to fetch profile data. Please try again later.');
    }
  };

  const onFinish = async (values) => {
    try {
      await HTTPService.put(`auth/organization/profile/${profile.id}`, values);
      message.success('Profile updated successfully!');
      fetchProfile();
      setEditingField(null);
    } catch (error) {
      message.error('Failed to update profile. Please check your input and try again.');
    }
  };

  const showPasswordModal = () => {
    setIsPasswordModalVisible(true);
  };

  const handlePasswordChange = async (values) => {
    try {
      await HTTPService.post(`auth/change-password`, values);
      message.success('Password changed successfully!');
      setIsPasswordModalVisible(false);
    } catch (error) {
      message.error('Failed to change password. Please check your input and try again.');
    }
  };

  if (!profile) return <Card className="styled-card"><Title level={3}>Loading your profile...</Title></Card>;

  const renderField = (name, label, editable = true) => (
    <div className="field-container">
      <Text strong className="field-label">{label}:</Text>
      <Form.Item name={name} style={{ marginBottom: 0, flexGrow: 1 }}>
        <Input readOnly={editingField !== name} className="field-value" />
      </Form.Item>
      {editable && (
        <Tooltip title={editingField === name ? "Save" : "Edit"}>
          <Button
            icon={editingField === name ? <SaveOutlined /> : <EditOutlined />}
            onClick={() => {
              if (editingField === name) {
                form.submit();
              } else {
                setEditingField(name);
              }
            }}
            className={`action-button ${editingField === name ? 'save-button' : 'edit-button'}`}
          >
            {editingField === name ? 'Save' : 'Edit'}
          </Button>
        </Tooltip>
      )}
    </div>
  );

  return (
    <Card className="styled-card">
      <Form form={form} onFinish={onFinish}>
        <div className="logo-container">
          <img src={profile.logo_url} alt={profile.name} className="styled-logo" />
        </div>
        <Title level={2} className="welcome-message">Welcome, {profile.name}!</Title>
        
        {renderField('name', 'Organization Name')}
        {renderField('address', 'Address')}
        {renderField('business_registration_number', 'Business Registration Number')}
        {renderField(['user', 'username'], 'Username')}
        <div className="field-container">
          <Text strong className="field-label">Email:</Text>
          <Text>{profile.user.email}</Text>
        </div>

        <Space style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <Button type="primary" onClick={() => form.submit()} icon={<SaveOutlined />} className="action-button">
            Save All Changes
          </Button>
          <Button icon={<LockOutlined />} onClick={showPasswordModal} className="action-button">
            Change Password
          </Button>
        </Space>
      </Form>

      <Modal
        title="Change Password"
        visible={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handlePasswordChange} layout="vertical">
          <Form.Item name="current_password" label="Current Password" rules={[{ required: true, message: 'Please enter your current password' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="new_password" label="New Password" rules={[
            { required: true, message: 'Please enter your new password' },
            { min: 8, message: 'Password must be at least 8 characters long' }
          ]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="confirm_password" label="Confirm New Password" rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match'));
              },
            }),
          ]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AccountSettings;