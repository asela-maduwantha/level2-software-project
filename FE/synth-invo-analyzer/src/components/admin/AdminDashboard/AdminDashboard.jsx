import React from 'react';
import { Row, Col } from 'antd';
import MonthlySubscriptionsChart from '../MonthlySubscriptionsChart/MonthlySubscriptionsChart';
import SubscriptionModelUsersChart from '../SubscriptionModelUsersChart/SubscriptionModelUsersChart';
import MonthlyRevenueChart from '../MonthlyRevenueChart/MonthlyRevenueChart';

const AdminDashboard = () => {
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <MonthlySubscriptionsChart/>
        </Col>
        <Col span={8}>
          <SubscriptionModelUsersChart/>
        </Col>
        <Col span={8}>
          <MonthlyRevenueChart/>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
