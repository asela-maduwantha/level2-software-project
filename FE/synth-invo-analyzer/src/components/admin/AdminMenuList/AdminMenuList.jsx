import React from 'react';
import { Menu } from 'antd';
import { 
  DashboardOutlined, 
  UploadOutlined, 
  ProfileOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  EditOutlined, 
  MessageOutlined, 
  SettingOutlined, 
  BarChartOutlined, 
  UserOutlined, 
  LogoutOutlined 
} from '@ant-design/icons'; // Importing Ant Design icons
import { Link } from 'react-router-dom';
import './AdminMenuList.css';

const AdminMenuList = () => {
  return (
    <div>
      <Menu theme='light' mode='inline' className='menu-bar'>
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="dashboard" style={{ textDecoration: "none" }}>Dashboard</Link>
        </Menu.Item>
        
        <Menu.SubMenu key="supplier-templates" title="Supplier Templates" icon={<ProfileOutlined />}>
          <Menu.Item key="upload-mapping" icon={<UploadOutlined />}>
            <Link to="upload-mapping" style={{ textDecoration: "none" }}>Mapping Requests</Link>
          </Menu.Item>
        </Menu.SubMenu>
        
        <Menu.SubMenu key="subscription" title="Subscription" icon={<SettingOutlined />}>
          <Menu.Item key="create-model" icon={<PlusOutlined />}>
            <Link to="createmodel" style={{ textDecoration: "none" }}>Create Model</Link>
          </Menu.Item>
          <Menu.Item key="update-model" icon={<EditOutlined />}>
            <Link to="updatemodel" style={{ textDecoration: "none" }}>Update Model</Link>
          </Menu.Item>
          <Menu.Item key="archive-model" icon={<DeleteOutlined />}>
            <Link to="archivemodel" style={{ textDecoration: "none" }}>Delete Model</Link>
          </Menu.Item>
          <Menu.Item key="add-feature" icon={<PlusOutlined />}>
            <Link to="add-feature" style={{ textDecoration: "none" }}>Add Feature</Link>
          </Menu.Item>
          <Menu.Item key="modify-feature" icon={<EditOutlined />}>
            <Link to="modify-feature" style={{ textDecoration: "none" }}>Modify Feature</Link>
          </Menu.Item>
        </Menu.SubMenu>
        
        <Menu.Item key="chat" icon={<MessageOutlined />}>
          <Link to="chat" style={{ textDecoration: "none" }}>Chat</Link>
        </Menu.Item>

        <Menu.SubMenu key="account-settings" title="Account Settings" icon={<SettingOutlined />}>
          <Menu.Item key="user-management" icon={<UserOutlined />}>
            <Link to="user-management" style={{ textDecoration: "none" }}>User Management</Link>
          </Menu.Item>
          <Menu.Item key="system-analysis" icon={<BarChartOutlined />}>
            <Link to="system-analysis" style={{ textDecoration: "none" }}>System Analysis</Link>
          </Menu.Item>
        </Menu.SubMenu>
        
        <Menu.Item key="logout" icon={<LogoutOutlined />}>
          <Link to="logout" style={{ textDecoration: "none" }}>Logout</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default AdminMenuList;
