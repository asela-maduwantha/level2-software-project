import React from 'react';
import { Menu } from 'antd';
import { DashboardOutlined, EditOutlined, ToolOutlined, UserOutlined, LogoutOutlined, SettingOutlined, BarChartOutlined } from '@ant-design/icons'; // Importing Ant Design icons
import { Link } from 'react-router-dom';
import './AdminMenuList.css';

const AdminMenuList = () => {
  return (
    <div>
      <Menu theme='light' mode='inline' className='menu-bar'>
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="dashboard" style={{textDecoration:"none"}}>Dashboard</Link>
        </Menu.Item>
        <Menu.SubMenu key="mapping requests" title="Supplier Templates" icon={<ToolOutlined />}>
          <Menu.Item key="upload-mapping">
            <Link to="upload-mapping" style={{textDecoration:"none"}}>Mapping Requests</Link>
          </Menu.Item>
          
        </Menu.SubMenu>
        
        <Menu.SubMenu key="subscription" title="Subscription" icon={<ToolOutlined />}>
          <Menu.Item key="add-model">
            <Link to="createmodel" style={{textDecoration:"none"}}>Create Model</Link>
          </Menu.Item>
          <Menu.Item key="update-model">
            <Link to="updatemodel" style={{textDecoration:"none"}}>Update Model</Link>
          </Menu.Item>
          <Menu.Item key="archive-model">
            <Link to = "archivemodel" style={{textDecoration:"none"}}>Delete Model</Link>
          </Menu.Item>
          <Menu.Item key="add-feature">
            <Link to="add-feature" style={{textDecoration:"none"}}>Add Feature</Link>
          </Menu.Item>
          <Menu.Item key="modify-feature">
            <Link to="modify-feature" style={{textDecoration:"none"}}>Modify Feature</Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="account-settings" title="Account Settings" icon={<SettingOutlined />}>
          <Menu.Item key="user-management" icon={<UserOutlined />}>
            <Link to="user-management" style={{textDecoration:"none"}}>User Management</Link>
          </Menu.Item>
          <Menu.Item key="system-analysis" icon={<BarChartOutlined />}>
            <Link to="system-analysis" style={{textDecoration:"none"}}>System Analysis</Link>
          </Menu.Item>
          
        </Menu.SubMenu>
        <Menu.Item key="logout" icon={<LogoutOutlined />}>
            <Link to="logout" style={{textDecoration:"none"}}>Logout</Link>
          </Menu.Item>
      </Menu>
   </div>
  );
};

export default AdminMenuList;
