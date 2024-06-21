import React, { useEffect, useState } from 'react';
import { Table, Button, Card, message } from 'antd';
import axios from 'axios';

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/auth/get-add-requests-by-supplier/${user_id}`);
        setRequests(response.data);
      } catch (error) {
        message.error('Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user_id]);

  const handleAccept = async (record) => {
    try {
      await axios.post(`http://127.0.0.1:8000/auth/accept-request/${record.request_id}/`, {
        user_id: user_id,
        request_id: record.request_id,
      });
      message.success(`Accepted request for ${record.requested_organization}`);
      setRequests(requests.filter(req => req.request_id !== record.request_id));
    } catch (error) {
      message.error('Failed to accept request');
    }
  };

  const handleDismiss = async (record) => {
    try {
      await axios.post(`http://127.0.0.1:8000/auth/dismiss-request/${record.request_id}/`, {
        user_id: user_id,
        request_id: record.request_id,
      });
      message.error(`Dismissed request for ${record.requested_organization}`);
      setRequests(requests.filter(req => req.request_id !== record.request_id));
    } catch (error) {
      message.error('Failed to dismiss request');
    }
  };

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'request_id',
      key: 'request_id',
    },
    {
      title: 'Requested Organization',
      dataIndex: 'requested_organization',
      key: 'requested_organization',
    },
    {
      title: 'Requested Time',
      dataIndex: 'requested_time',
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
