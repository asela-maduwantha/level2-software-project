import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

const RevenueAnalysis = () => {
    const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [yearlyRevenueData, setYearlyRevenueData] = useState([]);
  const [doughnutData, setDoughnutData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(localStorage.getItem('user_id'))
        const response = await axios.post('http://127.0.0.1:8000/analysis/generate_revenue_analysis/', {
          user_id: localStorage.getItem('organization_id')
          
        });
        const { monthly_revenue, yearly_revenue } = response.data;

        setMonthlyRevenueData(monthly_revenue);
        setYearlyRevenueData(yearly_revenue);
        setDoughnutData(yearly_revenue); // Assuming doughnutData is the same as yearly_revenue
      } catch (error) {
        console.error('Error fetching revenue analysis:', error);
      }
    };

    fetchData();
  }, []);

  const monthlyChartData = {
    labels: monthlyRevenueData.map(item => `${item.year}-${item.month}`),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: monthlyRevenueData.map(item => item.revenue),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const yearlyChartData = {
    labels: yearlyRevenueData.map(item => item.year),
    datasets: [
      {
        label: 'Yearly Revenue',
        data: yearlyRevenueData.map(item => item.revenue),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FFCD56",
          "#C9CBCF",
          "#36A3EB",
          "#FF6384"
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: doughnutData.map(item => item.year),
    datasets: [
      {
        label: 'Yearly Revenue',
        data: doughnutData.map(item => item.revenue),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FFCD56",
          "#C9CBCF",
          "#36A3EB",
          "#FF6384"
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '60%', margin: '0 auto', marginBottom: '50px' }}>
        <h2>Monthly Revenue</h2>
        <Bar data={monthlyChartData} />
      </div>
      <h2>Yearly Revenue</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '55px', marginTop: '20px' }}>
        <div style={{ width: '300px' }}>
          <Pie data={yearlyChartData} />
        </div>
        <div style={{ width: '300px' }}>
          <Doughnut data={yearlyChartData} />
        </div>
      </div>
    </div>
  );
};


export default RevenueAnalysis
