import React from 'react';
import { Row, Col, Typography } from 'antd';
import MonthlySubscriptionsChart from '../MonthlySubscriptionsChart/MonthlySubscriptionsChart';
import SubscriptionModelUsersChart from '../SubscriptionModelUsersChart/SubscriptionModelUsersChart';
import MonthlyRevenueChart from '../MonthlyRevenueChart/MonthlyRevenueChart';

const { Title } = Typography;

const AdminDashboard = () => {
  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>Admin Dashboard</Title>
      <Row gutter={[16, 24]}>
        <Col xs={24} md={12} lg={8}>
          <MonthlySubscriptionsChart />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <SubscriptionModelUsersChart />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <MonthlyRevenueChart />
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
