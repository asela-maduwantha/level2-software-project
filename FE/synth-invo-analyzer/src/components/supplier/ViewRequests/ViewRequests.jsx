import React, { useEffect, useState } from 'react';
import { Table, Button, Card, message } from 'antd';
import HTTPService from '../../../Service/HTTPService';

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const supplier_email = localStorage.getItem('email');
  const supplier_id = localStorage.getItem('supplier_id')

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await HTTPService.get(`auth/supplier/pending-requests/`,{
          params:{
            supplier_email : supplier_email,
          },
        });
        setRequests(response.data);
      } catch (error) {
        message.error('Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [supplier_email]);

  const handleAccept = async (record) => {
    try {
      await HTTPService.post(`auth/accept-request/`, {
        supplier_id: supplier_id,
        organization_id: record.organization_id,
        email : supplier_email
      });
      message.success(`Accepted request for ${record.organization_name}`);
      setRequests(requests.filter(req => req.organization_id !== record.organization_id));
    } catch (error) {
      message.error('Failed to accept request');
    }
  };

  const handleDismiss = async (record) => {
    try {
      await HTTPService.post(`auth/dismiss-request/${record.request_id}/`, {
        supplier_id: supplier_id,
        organization_id: record.id,
      });
      message.error(`Dismissed request for ${record.organization_name}`);
      setRequests(requests.filter(req => req.organization_id !== record.organization_id));
    } catch (error) {
      message.error('Failed to dismiss request');
    }
  };

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'request_id',
    },
    {
      title: 'Requested Organization',
      dataIndex: 'organization_name',
      key: 'requested_organization',
    },
    {
      title: 'Requested Time',
      dataIndex: 'created_at',
      key: 'requested_time',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={() => handleAccept(record)} style={{ marginRight: 8 }}>
            Accept
          </Button>
          <Button type="danger" onClick={() => handleDismiss(record)}>
            Dismiss
          </Button>
        </span>
      ),
    },
  ];

  return (
    <Card title="Customer Requests">
      <Table
        columns={columns}
        dataSource={requests}
        loading={loading}
        rowKey={(record) => record.request_id}
      />
    </Card>
  );
};

export default ViewRequests;
