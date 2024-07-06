// src/SearchInvoices.js

import React, { useState, useEffect } from 'react';
import { Input, Button, Table, message, Select } from 'antd';
import HTTPService from '../../../Service/HTTPService';

const { Search } = Input;
const { Option } = Select;

const SearchInvoices = () => {
  const [issuer, setIssuer] = useState('');
  const [recipient, setRecipient] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const user_id = localStorage.getItem('user_id');
      try {
        const response = await HTTPService.get(`auth/get-suppliers-by-organization/${user_id}`);
        setSuppliers(response.data.suppliers);
      } catch (error) {
        message.error('Failed to fetch suppliers');
      }
    };

    fetchSuppliers();
  }, []);

  const columns = [
    {
      title: 'Invoice ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Issuer',
      dataIndex: '_source',
      key: 'issuer',
      render: (text) => text.issuer,
    },
    {
      title: 'Internal Format',
      dataIndex: '_source',
      key: 'internal_format',
      render: (text) => text.internal_format,
    },
    {
      title: 'Created At',
      dataIndex: '_source',
      key: 'created_at',
      render: (text) => new Date(text.created_at).toLocaleString(),
    },
  ];

  const fetchData = async () => {

    setLoading(true);
    try {
      const recipient = localStorage.getItem('user_id');
      
      const response = await HTTPService.get('search/', {  params: { issuer, recipient }, });
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch data');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Search Invoices</h1>
      <Select
  placeholder="Select Supplier"
  value={issuer}
  onChange={(value) => setIssuer(value)}
  style={{ width: '20%', marginBottom: 8, marginRight: '20px' }}
>
  <Option >All</Option>
  {suppliers.map((supplier) => (
    <Option key={supplier.supplier_id} value={supplier.supplier_id}>
      {supplier.username}
    </Option>
  ))}
</Select>

      <Button type="primary" onClick={fetchData} loading={loading}>
        Search
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record._id}
        loading={loading}
        style={{ marginTop: 24 }}
      />
    </div>
  );
};

export default SearchInvoices;
