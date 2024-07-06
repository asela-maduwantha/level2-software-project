import React, { useEffect, useState } from 'react';
import HTTPService from '../../../Service/HTTPService';
import { Card, Typography, message, Row, Col, Select, Button, Table, Switch } from 'antd';
import { Pie } from 'react-chartjs-2';

const { Title } = Typography;
const { Option } = Select;

const SupplierAnalysis = () => {
    const [suppliersExpenditures, setSuppliersExpenditures] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [chartData, setChartData] = useState(null);
    const [viewMode, setViewMode] = useState('chart');

    useEffect(() => {
        fetchSupplierExpenditures();
    }, [selectedYear]);

    const fetchSupplierExpenditures = async () => {
        try {
            const organization_id = localStorage.getItem('organization_id');
            if (!organization_id) {
                throw new Error('Organization ID not found in localStorage');
            }

            const response = await HTTPService.get(`analysis/supplier-expenditures/`, {
                params: { organization_id, year: selectedYear }
            });

            const suppliersData = response.data;

            // Calculate total amount across all suppliers
            const totalAmountAll = suppliersData.reduce((acc, supplier) => acc + supplier.total_amount, 0);

            // Calculate percentage for each supplier
            const suppliersWithPercentage = suppliersData.map(supplier => ({
                ...supplier,
                percentage: ((supplier.total_amount / totalAmountAll) * 100).toFixed(2)
            }));

            // Prepare data for Chart.js
            const labels = suppliersWithPercentage.map(supplier => supplier.supplier_name);
            const data = suppliersWithPercentage.map(supplier => supplier.total_amount);

            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Supplier Expenditures',
                        data: data,
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#8E5EA2',
                            '#FF7F50',
                            '#20B2AA',
                            '#87CEEB',
                        ],
                    },
                ],
            };

            setSuppliersExpenditures(suppliersWithPercentage);
            setChartData(chartData);
        } catch (error) {
            console.error('Error fetching supplier expenditures:', error.message);
            message.error('Failed to fetch supplier expenditures.');
        }
    };

    const handleYearChange = (value) => {
        setSelectedYear(value);
        setChartData(null); // Clear chart data when year changes to indicate loading
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1
        },
        {
            title: 'Supplier Name',
            dataIndex: 'supplier_name',
            key: 'supplier_name',
        },
        {
            title: 'Total Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (amount) => `$${amount.toFixed(2)}`,
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage',
            key: 'percentage',
            render: (percentage) => `${percentage}%`,
        },
    ];

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Title level={2} style={{ marginBottom: '20px', textAlign: 'center' }}>Supplier Expenditures Analysis</Title>
            <Row gutter={[16, 16]} justify="end" align="middle">
                <Col xs={24} md={8}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select a year"
                        onChange={handleYearChange}
                        defaultValue={selectedYear}
                    >
                        {[2021, 2022, 2023, 2024].map(year => (
                            <Option key={year} value={year.toString()}>{year}</Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                    <Switch
                        checkedChildren="Chart"
                        unCheckedChildren="Table"
                        checked={viewMode === 'chart'}
                        onChange={(checked) => handleViewModeChange(checked ? 'chart' : 'table')}
                    />
                </Col>
            </Row>

            {viewMode === 'chart' && chartData && (
                <Card title="Supplier Expenditures Chart" style={{ marginTop: '20px' }}>
                    <div style={{ height: '400px' }}>
                        <Pie data={chartData} />
                    </div>
                </Card>
            )}

            {viewMode === 'table' && (
                <Card title="Supplier Expenditures Table" style={{ marginTop: '20px' }}>
                    <Table
                        dataSource={suppliersExpenditures.map((supplier, index) => ({
                            ...supplier,
                            index,
                        }))}
                        columns={columns}
                        pagination={false}
                    />
                </Card>
            )}
        </div>
    );
};

export default SupplierAnalysis;
