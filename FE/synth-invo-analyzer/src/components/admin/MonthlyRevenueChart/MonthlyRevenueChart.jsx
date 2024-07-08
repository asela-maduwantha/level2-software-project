import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import HTTPService from '../../../Service/HTTPService';
import { Card } from 'antd';

const MonthlyRevenueChart = () => {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    HTTPService.get('subscriptions/monthly-revenue/')
      .then(response => {
        setRevenueData(response.data);
      })
      .catch(error => {
        console.error('Error fetching monthly revenue data:', error);
      });
  }, []);

  if (!Array.isArray(revenueData)) {
    return <div>Loading...</div>; // Or handle error state here
  }

  const chartData = {
    labels: revenueData.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: revenueData.map(item => item.revenue),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <Card title="Monthly Revenue" bordered={false} style={{ height: '100%' }}>
      <Line data={chartData} />
    </Card>
  );
};

export default MonthlyRevenueChart;
