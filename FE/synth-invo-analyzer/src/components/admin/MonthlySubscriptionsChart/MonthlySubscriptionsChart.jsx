// MonthlySubscriptionsChart.js

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import HTTPService from '../../../Service/HTTPService';

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
        label: 'Monthly Added Subscriptions',
        data: monthlyData.map(item => item.count),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <div>
      <h2>Monthly Added Subscriptions</h2>
      <Line data={chartData} />
    </div>
  );
};

export default MonthlySubscriptionsChart;
