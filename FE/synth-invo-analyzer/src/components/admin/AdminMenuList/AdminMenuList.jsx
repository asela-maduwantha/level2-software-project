import React, { useState } from 'react';
import { Menu } from 'antd';
import { 
  DashboardOutlined, 
  FileSearchOutlined, 
  ProfileOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  EditOutlined, 
  MessageOutlined, 
  SettingOutlined, 
  BarChartOutlined, 
  UserOutlined, 
  LogoutOutlined,
  UploadOutlined
} from '@ant-design/icons'; 
import { Link } from 'react-router-dom';
import './AdminMenuList.css';

const { SubMenu } = Menu;

const AdminMenuList = () => {
  const [openKeys, setOpenKeys] = useState([]);

  const handleMenuOpenChange = (keys) => {
    if (keys.length === 0) {
      setOpenKeys([]);
    } else {
      setOpenKeys([keys[keys.length - 1]]);
    }
  };

  return (
    <div>
      <Menu
        theme='light'
        mode='inline'
        className='menu-bar'
        openKeys={openKeys}
        onOpenChange={handleMenuOpenChange}
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="dashboard" style={{ textDecoration: "none" }}>Dashboard</Link>
        </Menu.Item>
        
        <Menu.Item key="advance-search" icon={<FileSearchOutlined />}>
          <Link to="advanced-search" style={{ textDecoration: "none" }}>Advanced Search</Link>
        </Menu.Item>
        
        <SubMenu key="supplier-templates" title="Supplier Templates" icon={<ProfileOutlined />}>
          <Menu.Item key="upload-mapping" icon={<UploadOutlined />}>
            <Link to="upload-mapping" style={{ textDecoration: "none" }}>Mapping Requests</Link>
          </Menu.Item>
        </SubMenu>
        
        <SubMenu key="subscription" title="Subscription" icon={<SettingOutlined />}>
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
        </SubMenu>
        
        <Menu.Item key="chat" icon={<MessageOutlined />}>
          <Link to="chat" style={{ textDecoration: "none" }}>Chat</Link>
        </Menu.Item>

        <SubMenu key="account-settings" title="Account Settings" icon={<SettingOutlined />}>
          <Menu.Item key="user-management" icon={<UserOutlined />}>
            <Link to="user-management" style={{ textDecoration: "none" }}>User Management</Link>
          </Menu.Item>
          <Menu.Item key="system-analysis" icon={<BarChartOutlined />}>
            <Link to="system-analysis" style={{ textDecoration: "none" }}>System Analysis</Link>
          </Menu.Item>
        </SubMenu>
        
        <Menu.Item key="logout" icon={<LogoutOutlined />}>
          <Link to="logout" style={{ textDecoration: "none" }}>Logout</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default AdminMenuList;
