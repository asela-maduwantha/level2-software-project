import React, { useState, useEffect } from 'react';
import HTTPService from '../../../Service/HTTPService';
import { Card, Typography, message, Row, Col, Select, Table } from 'antd';
import { Line } from 'react-chartjs-2';

const { Title } = Typography;
const { Option } = Select;

const SupplierCompare = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [selectedProductCurrency, setSelectedProductCurrency] = useState(null);
  const organization_id = localStorage.getItem('organization_id');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await HTTPService.get('search/get-prod-by-org/', {
          params: { organization_id: organization_id }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        message.error('Failed to fetch product list.');
      }
    };

    fetchProducts();
  }, []);

  const fetchPriceData = async () => {
    try {
      const response = await HTTPService.get('analysis/suppliers-price-by-month/', {
        params: {
          year: selectedYear,
          product_name: selectedProduct,
          organization_id: organization_id,
          suppliers: selectedSuppliers
        }
      });
      setPriceData(response.data);
      message.success('Invoice data fetched successfully.');
    } catch (error) {
      console.error('Error fetching invoice data:', error);
      setPriceData([]);
      message.error('Failed to fetch invoice data.');
    }
  };

  useEffect(() => {
    if (selectedProduct && selectedYear) {
      fetchPriceData();
    }
  }, [selectedProduct, selectedYear, selectedSuppliers]);

  const handleProductChange = (value) => {
    const product = products.find(p => p.description === value);
    setSelectedProduct(value);
    setSelectedProductCurrency(product.currency);
    setSelectedYear(product.years[0]);
    setPriceData([]);
    setSelectedSuppliers([]);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    setPriceData([]);
  };

  const handleSupplierChange = (value) => {
    setSelectedSuppliers(value);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const lineData = {
    labels: ['Average Price'],
    datasets: priceData.map(item => ({
      label: item.supplier,
      data: [item.avg_price],
      borderColor: getRandomColor(),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: false,
    }))
  };

  const columns = [
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: 'Average Price',
      dataIndex: 'avg_price',
      key: 'avg_price',
      render: (price) => price.toFixed(2)
    }
  ];

  const availableSuppliers = [...new Set(priceData.map(item => item.supplier))];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '20px', textAlign: 'center' }}>Price Comparison</Title>
      <Row gutter={[16, 16]} justify="end" align="middle">
        <Col xs={24} md={8}>
          <Select
            style={{ width: '100%' }}
            placeholder="Select a product"
            onChange={handleProductChange}
          >
            {products.map((product, index) => (
              <Option key={index} value={product.description}>{product.description}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={8}>
          <Select
            style={{ width: '100%' }}
            placeholder="Select a year"
            onChange={handleYearChange}
            value={selectedYear}
            disabled={!selectedProduct}
          >
            {selectedProduct && products.find(p => p.description === selectedProduct).years.map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={8}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select suppliers"
            onChange={handleSupplierChange}
            value={selectedSuppliers}
            disabled={!selectedProduct || !selectedYear}
          >
            {availableSuppliers.map((supplier, index) => (
              <Option key={index} value={supplier}>{supplier}</Option>
            ))}
          </Select>
        </Col>
      </Row>
      {selectedProduct && selectedProductCurrency && (
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <strong>Currency:</strong> {selectedProductCurrency}
        </div>
      )}
      {priceData.length > 0 && (
        <Card title="Invoice Data Analysis" style={{ marginTop: '20px' }}>
          <div style={{ height: '400px' }}>
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: {
                    display: true,
                    text: 'Average Price by Supplier'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: `Price (${selectedProductCurrency})`
                    }
                  }
                }
              }}
            />
          </div>
          <Table
            dataSource={priceData}
            columns={columns}
            pagination={false}
          />
        </Card>
      )}
    </div>
  );
};

export default SupplierCompare;