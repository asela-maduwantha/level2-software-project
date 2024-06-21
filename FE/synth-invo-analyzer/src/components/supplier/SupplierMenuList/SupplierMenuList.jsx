import React from 'react';
import { Menu } from 'antd';
import { DashboardOutlined, FileTextOutlined, SolutionOutlined, ToolOutlined } from '@ant-design/icons'; // Importing Ant Design icons
import { Link } from 'react-router-dom';
import './SupplierMenuList.css';

const SupplierMenuList = () => {
  return (
    <div>
      <Menu theme='light' mode='inline' className='menu-bar'>
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="dashboard" style={{textDecoration:"none"}}>Dashboard</Link>
        </Menu.Item>
        <Menu.SubMenu key="invoice" title="Invoices" icon={<FileTextOutlined  />}>
        <Menu.Item key="sendinvoice" >
          <Link to="sendinvoice" style={{textDecoration:"none"}}>Send Invoice</Link>
        </Menu.Item>
        <Menu.Item key="viewinvoice" >
          <Link to="viewinvoices" style={{textDecoration:"none"}}>View Invoice</Link>
        </Menu.Item>
        </Menu.SubMenu>
        
        <Menu.Item key="viewrequests" icon={<SolutionOutlined />}>
          <Link to="viewrequests" style={{textDecoration:"none"}}>View Requests</Link>
        </Menu.Item>
      <Menu.SubMenu key="template" title="Template" icon={<ToolOutlined />}>
      <Menu.Item key="uploadtemplate" >
          <Link to="uploadtemplate" style={{textDecoration:"none"}}>Upload Template</Link>
        </Menu.Item>
    
      <Menu.Item key="viewtemplate" >
          <Link to="viewtemplate" style={{textDecoration:"none"}}>View Templates</Link>
        </Menu.Item>
      </Menu.SubMenu>
      </Menu>
    </div>
  );
};

export default SupplierMenuList;
