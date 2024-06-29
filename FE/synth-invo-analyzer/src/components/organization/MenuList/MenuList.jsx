import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  DashboardOutlined,
  LineChartOutlined,
  UserOutlined,
  ContainerOutlined,
  ShopOutlined,
  LogoutOutlined,
  UpCircleOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import './menulist.css';

const MenuList = () => {
  const [openKeys, setOpenKeys] = useState([]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
    } else {
      setOpenKeys([]);
    }
  };

  return (
    <div>
      <Menu 
        theme='light' 
        mode='inline' 
        className='menu-bar'
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        <Menu.Item key="home" icon={<DashboardOutlined />}>
          <Link to="dashboard" style={{textDecoration:"none"}}>Dashboard</Link>
        </Menu.Item>
        <Menu.SubMenu key="invoices" icon={<ContainerOutlined />} title="Invoices">
          <Menu.Item key="view-invoices">
            <Link to="viewinvoices" style={{textDecoration:"none"}}>View Invoices</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="suppliers" icon={<ShopOutlined />} title="Suppliers">
          <Menu.Item key="add-supplier">
            <Link to="addsupplier" style={{textDecoration:"none"}}>Add Supplier</Link>
          </Menu.Item>
          <Menu.Item key="supplier-requests">
            <Link to="supplierrequests" style={{textDecoration:"none"}}>Outgoing Requests</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="employee-manage" icon={<UserOutlined />} title="Employee Management">
          <Menu.Item key="add-employee">
            <Link to="addemployee" style={{textDecoration:"none"}}>Add Employee</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="analysis" icon={<LineChartOutlined />} title="Analysis">
          <Menu.Item key="product-analysis">
            <Link to="productanalysis" style={{textDecoration:"none"}}>Product Analysis</Link>
          </Menu.Item>
          <Menu.Item key="seasonal-analysis">
            <Link to="seasonalanalysis" style={{textDecoration:"none"}}>Seasonal Analysis</Link>
          </Menu.Item>
          <Menu.Item key="revenue-analysis">
            <Link to="revenueanalysis" style={{textDecoration:"none"}}>Revenue Analysis</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="account" icon={<UserOutlined />} title="Account">
          <Menu.Item key="edit-account">
            <Link to="accountsettings" style={{textDecoration:"none"}}>Edit Account</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="change-plan" icon={<UpCircleOutlined />}>
          <Link to="analytics" style={{textDecoration:"none"}}>Upgrade</Link>
        </Menu.Item>
        <Menu.Item key="logout" icon={<LogoutOutlined />}>Logout</Menu.Item>
      </Menu>
    </div>
  );
};

export default MenuList;