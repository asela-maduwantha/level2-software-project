// SubscriptionModelUsersChart.js

import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

const SubscriptionModelUsersChart = () => {
  const [modelData, setModelData] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/subscriptions/subscription-model-users/')
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
        label: 'Subscription Model-wise Users',
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
    <div>
      <h2>Subscription Model-wise Users</h2>
      <Doughnut data={chartData} />
    </div>
  );
};

export default SubscriptionModelUsersChart;
