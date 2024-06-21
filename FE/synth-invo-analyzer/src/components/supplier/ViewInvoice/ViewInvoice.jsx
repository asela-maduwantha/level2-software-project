import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';
import InvoiceDetailsModal from '../../common/InvoiceDetailsModel/InvoiceDetailsModel';

const ViewInvoice = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null); // Use null instead of {} for better type handling

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const supplier_id = localStorage.getItem('supplier_id'); 
      const response = await axios.get(`http://localhost:8000/invoice/get-invoice-by-supplier/?supplier_id=${supplier_id}`);
      setData(response.data.invoices);
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
    setModalVisible(true); 
  };

  return (
    <div>
      <Table dataSource={data} columns={columns} />
      {selectedData && (
        <InvoiceDetailsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          invoice={JSON.parse(selectedData.internal_format)}
        />
      )}
    </div>
  );
};

export default ViewInvoice;
