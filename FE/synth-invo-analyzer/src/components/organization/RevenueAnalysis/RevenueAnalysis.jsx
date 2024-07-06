import React, { useEffect, useState } from 'react';
import HTTPService from '../../../Service/HTTPService';
import { Card, Typography, message, Row, Col, Select, Table, Switch } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const { Title } = Typography;
const { Option } = Select;

const RevenueAnalysis = () => {
  const [expendituresData, setExpendituresData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [viewMode, setViewMode] = useState('graphical');
  const [selectedYear, setSelectedYear] = useState('All');
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { organization_id: localStorage.getItem('organization_id') };
        const response = await HTTPService.get('analysis/monthly-expenditure/', { params });
        setExpendituresData(response.data);
        setFilteredData(response.data);
        
        // Extract years from the data for year select options
        const years = response.data.map(entry => entry.month.split('-')[0]);
        const uniqueYears = Array.from(new Set(years));
        setAvailableYears(['All', ...uniqueYears]);
        
      } catch (error) {
        console.error('Error fetching expenditures data:', error);
        message.error('Failed to fetch expenditures data.');
      }
    };

    fetchData();
  }, []);

  const processChartData = (data) => {
    const groupedData = data.reduce((acc, { month, total_expenditure }) => {
      const [year, monthNum] = month.split('-');
      if (!acc[year]) acc[year] = { label: year, data: Array(12).fill(0) };
      acc[year].data[parseInt(monthNum) - 1] = total_expenditure;
      return acc;
    }, {});

    const datasets = Object.values(groupedData).map(yearData => ({
      label: yearData.label,
      data: yearData.data,
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1
    }));

    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets
    };
  };

  const getRandomColor = () => {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
      '#FFCD56', '#C9CBCF', '#36A3EB', '#FF6384'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const chartData = processChartData(filteredData);

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      render: (month) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[parseInt(month.split('-')[1], 10) - 1];
      }
    },
    {
      title: 'Total Expenditure',
      dataIndex: 'total_expenditure',
      key: 'total_expenditure',
      render: value => value.toFixed(2),
    },
  ];

  const handleViewToggle = () => {
    setViewMode(viewMode === 'graphical' ? 'tabular' : 'graphical');
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    if (value === 'All') {
      setFilteredData(expendituresData);
    } else {
      const filtered = expendituresData.filter(entry => entry.month.startsWith(value));
      setFilteredData(filtered);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '20px', textAlign: 'center' }}>Expenditure Analysis</Title>
      <Row gutter={[16, 16]} justify="end" align="middle">
        <Col xs={24} md={8}>
          <Select
            style={{ width: '100%' }}
            placeholder="Select a year"
            onChange={handleYearChange}
            value={selectedYear}
          >
            {availableYears.map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={8}>
          <Switch
            checkedChildren="Chart"
            unCheckedChildren="Table"
            checked={viewMode === 'graphical'}
            onChange={handleViewToggle}
            disabled={selectedYear === 'All'}
          />
        </Col>
      </Row>
      {filteredData.length > 0 && (
        <Card title="Expenditure Analysis" style={{ marginTop: '20px' }}>
          {viewMode === 'graphical' ? (
            <div style={{ height: '400px' }}>
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    title: {
                      display: true,
                      text: 'Monthly Expenditures'
                    }
                  }
                }}
              />
            </div>
          ) : (
            selectedYear !== 'All' && (
              <Table
                dataSource={filteredData.map((item, index) => ({ ...item, key: index }))}
                columns={columns}
                pagination={false}
              />
            )
          )}
        </Card>
      )}
    </div>
  );
};

export default RevenueAnalysis;
