import React, { useEffect, useState } from 'react';
import HTTPService from '../../../Service/HTTPService';
import { Table, message } from 'antd';
import './OutgoingSupplierRequests.css'

const OutgoingSupplierRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const orgId = localStorage.getItem('organization_id');
        const response = await HTTPService.get(`auth/organization/pending-requests/?orgId=${orgId}`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requests:', error);
        message.error('Failed to load requests.');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const columns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Organization Name',
      dataIndex: 'organization_name',
      key: 'organization_name',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <div className="request-status-table">
      <h2>Pending Supplier Requests</h2>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default OutgoingSupplierRequests;
