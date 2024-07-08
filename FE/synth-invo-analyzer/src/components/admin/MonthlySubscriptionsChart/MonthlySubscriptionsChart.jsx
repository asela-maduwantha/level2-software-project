import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import HTTPService from '../../../Service/HTTPService';
import { Card } from 'antd';

const MonthlySubscriptionsChart = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    HTTPService.get('subscriptions/monthly-subscriptions/')
      .then(response => {
        setMonthlyData(response.data);
      })
      .catch(error => {
        console.error('Error fetching monthly subscriptions data:', error);
      });
  }, []);

  const chartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Subscriptions',
        data: monthlyData.map(item => item.count),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <Card title="Monthly Subscriptions" bordered={false} style={{ height: '100%' }}>
      <Line data={chartData} />
    </Card>
  );
};

export default MonthlySubscriptionsChart;
