import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Modal, message, Typography, Avatar, Space, Tooltip } from 'antd';
import { EditOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import styled from 'styled-components';

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  /* Remove border-radius to avoid rounded view */
  border-radius: 0; /* Optional: Ensure no rounded corners */
`;

const WelcomeMessage = styled(Title)`
  text-align: center;
  margin-bottom: 2rem !important;
`;

const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const FieldLabel = styled(Text)`
  font-weight: bold;
  margin-right: 1rem;
  min-width: 200px;
`;

const FieldValue = styled(Input)`
  flex-grow: 1;
`;

const EditButton = styled(Button)`
  margin-left: 1rem;
`;

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
      const response = await axios.get(`http://127.0.0.1:8000/auth/organization/profile/${organizationId}`);
      setProfile(response.data);
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error('Failed to fetch profile data');
    }
  };

  const onFinish = async (values) => {
    try {
      await axios.put(`http://127.0.0.1:8000/auth/organization/profile/${profile.id}`, values);
      message.success('Profile updated successfully');
      fetchProfile();
      setEditingField(null);
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  const showPasswordModal = () => {
    setIsPasswordModalVisible(true);
  };

  const handlePasswordChange = async (values) => {
    try {
      await axios.post(`http://127.0.0.1:8000/auth/change-password`, values);
      message.success('Password changed successfully');
      setIsPasswordModalVisible(false);
    } catch (error) {
      message.error('Failed to change password');
    }
  };

  if (!profile) return <div>Loading...</div>;

  const renderField = (name, label, editable = true) => (
    <FieldContainer>
      <FieldLabel>{label}:</FieldLabel>
      <Form.Item name={name} style={{ marginBottom: 0, flexGrow: 1 }}>
        <FieldValue readOnly={editingField !== name} />
      </Form.Item>
      {editable && (
        <Tooltip title={editingField === name ? "Save" : "Edit"}>
          <EditButton
            icon={<EditOutlined />}
            onClick={() => {
              if (editingField === name) {
                form.submit();
              } else {
                setEditingField(name);
              }
            }}
          />
        </Tooltip>
      )}
    </FieldContainer>
  );

  return (
    <StyledCard>
      <Form form={form} onFinish={onFinish}>
        <LogoContainer>
          <img src={profile.logo_url} alt={profile.name} width='400px' height='200px'/>
        </LogoContainer>
        <WelcomeMessage level={2}>Welcome, {profile.name}!</WelcomeMessage>
        
        {renderField('name', 'Organization Name')}
        {renderField('address', 'Address')}
        {renderField('business_registration_number', 'Business Registration Number')}
        {renderField(['user', 'username'], 'Username')}
        <FieldContainer>
          <FieldLabel>Email:</FieldLabel>
          <Text>{profile.user.email}</Text>
        </FieldContainer>

        <Space style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <Button type="primary" onClick={() => form.submit()}>
            Save All Changes
          </Button>
          <Button icon={<LockOutlined />} onClick={showPasswordModal}>
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
          <Form.Item name="current_password" label="Current Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="new_password" label="New Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </StyledCard>
  );
};

export default AccountSettings;
