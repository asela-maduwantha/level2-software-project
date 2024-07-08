import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import HTTPService from '../../../Service/HTTPService';
import { Card } from 'antd';

const SubscriptionModelUsersChart = () => {
  const [modelData, setModelData] = useState([]);

  useEffect(() => {
    HTTPService.get('subscriptions/subscription-model-users/')
      .then(response => {
        setModelData(response.data);
      })
      .catch(error => {
        console.error('Error fetching subscription model users data:', error);
      });
  }, []);

  const chartData = {
    labels: modelData.map(item => item.model_name),
    datasets: [
      {
        label: 'Users per Subscription Model',
        data: modelData.map(item => item.user_count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#8BC34A',
          '#9C27B0',
          '#FF5722'
        ]
      }
    ]
  };

  return (
    <Card title="Users per Subscription Model" bordered={false} style={{ height: '100%' }}>
      <Doughnut data={chartData} />
    </Card>
  );
};

export default SubscriptionModelUsersChart;
