import React, { useState, useEffect } from 'react';
import { Table, Modal, Typography } from 'antd';
import axios from 'axios';


const ViewReceivedInvoices = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [displayedInternalFormat, setDisplayedInternalFormat] = useState('');
  const [displayedSourceFormat, setDisplayedSourceFormat] = useState('');
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const organization_id = localStorage.getItem('organization_id'); 
      const response = await axios.get(`http://localhost:8000/invoice/get-invoice-by-organization/?orgId=${organization_id}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const columns = [
    {
      title: 'Sender',
      dataIndex: 'issuer',
      key: 'sender',
    },
    {
      title: 'Receiver',
      dataIndex: 'recipient',
      key: 'receiver',
    },
    {
      title: 'Datetime',
      dataIndex: 'created_at',
      key: 'datetime',
      render: (datetime) => new Date(datetime).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <button onClick={() => handleViewDetails(record)}>View Details</button>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    setSelectedData(record);
    setDisplayedInternalFormat(record.internal_format);
    setDisplayedSourceFormat(record.source_format);
    setModalVisible(true);
  };

  return (
    <div>
      <Table dataSource={data} columns={columns} />
      <Modal
        title="Invoice Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <p>Sender: {selectedData.issuer}</p>
        <p>Receiver: {selectedData.recipient}</p>
        <p>Datetime: {new Date(selectedData.created_at).toLocaleString()}</p>
        <p>Internal Format: {displayedInternalFormat}</p>
        <p>Source Format: {displayedSourceFormat}</p>
      </Modal>
    </div>
  );
};

export default ViewReceivedInvoices;
