import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Select, Input, Button, Table, message, DatePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AdvancedSearch = () => {
    const [query, setQuery] = useState({});
    const [builtQuery, setBuiltQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/search/execute-search/', { query: JSON.parse(builtQuery) });
            setSearchResults(response.data);
            message.success('Search results fetched successfully.');
        } catch (error) {
            console.error('Error fetching search results:', error);
            message.error('Failed to fetch search results.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setQuery(prev => ({ ...prev, [field]: value }));
    };

    const handleBuiltQueryChange = (e) => {
        setBuiltQuery(e.target.value);
    };

    useEffect(() => {
        const buildQuery = async () => {
            try {
                const response = await axios.post('http://localhost:8000/search/build-query/', { params: query });
                setBuiltQuery(JSON.stringify(response.data.query, null, 2));
            } catch (error) {
                console.error('Error building query:', error);
                message.error('Failed to build query.');
            }
        };

        buildQuery();
    }, [query]);

    const columns = [
        { title: 'Invoice Number', dataIndex: 'invoice_number', key: 'invoice_number' },
        { title: 'Supplier', dataIndex: 'seller', key: 'supplier' },
        { title: 'Buyer', dataIndex: 'buyer', key: 'buyer' },
        { title: 'Date', dataIndex: 'invoice_date', key: 'date', render: date => moment(date).format('YYYY-MM-DD') },
        { title: 'Total Amount', dataIndex: 'total_amount', key: 'total_amount' },
    ];

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Card title="Advanced Search" style={{ marginBottom: '20px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input
                            placeholder="Enter Supplier Name"
                            onChange={e => handleInputChange('supplier_name', e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <RangePicker
                            style={{ width: '100%' }}
                            placeholder={['Start Date', 'End Date']}
                            onChange={(dates, dateStrings) => handleInputChange('date_range', dateStrings)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input
                            placeholder="Enter Invoice Number"
                            onChange={e => handleInputChange('invoice_number', e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Select Currency"
                            onChange={value => handleInputChange('currency', value)}
                        >
                            <Option value="USD">USD</Option>
                            <Option value="EUR">EUR</Option>
                            <Option value="GBP">GBP</Option>
                            {/* Add other currency options */}
                        </Select>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Min Price"
                            onChange={value => handleInputChange('total_amount_min', value)}
                        >
                            <Option value={0}>0</Option>
                            <Option value={100}>100</Option>
                            <Option value={500}>500</Option>
                            {/* Add other options as needed */}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Max Price"
                            onChange={value => handleInputChange('total_amount_max', value)}
                        >
                            <Option value={1000}>1000</Option>
                            <Option value={5000}>5000</Option>
                            <Option value={10000}>10000</Option>
                            {/* Add other options as needed */}
                        </Select>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col xs={24}>
                        <Input.TextArea
                            value={builtQuery}
                            onChange={handleBuiltQueryChange}
                            rows={4}
                            placeholder="Built Query"
                        />
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                    <Col xs={24}>
                        <Button type="primary" onClick={handleSearch} loading={loading}>
                            Search
                        </Button>
                    </Col>
                </Row>
            </Card>
            <Card title="Search Results">
                <Table
                    columns={columns}
                    dataSource={searchResults}
                    rowKey={record => record._id}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default AdvancedSearch;
