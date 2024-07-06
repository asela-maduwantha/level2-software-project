import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import HTTPService from '../../../Service/HTTPService';
import InvoiceDetailsModal from '../../common/InvoiceDetailsModel/InvoiceDetailsModel';

const ViewInvoice = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const supplier_id = localStorage.getItem('supplier_id'); 
      const response = await HTTPService.get(`invoice/get-invoice-by-supplier/?supplier_id=${supplier_id}`);
      setData(response.data.invoices);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const columns = [
    {
      title: 'No.',
      key: 'no',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Recipient',
      dataIndex: 'recipient_name',
      key: 'recipient',
    },
    {
      title: 'Datetime',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (datetime) => new Date(datetime).toLocaleString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <button onClick={() => handleViewDetails(record)}>View more</button>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    setSelectedData(record); 
    setModalVisible(true); 
  };

  return (
    <div>
      <center>
        <h1>Invoices</h1>
        
        <Table dataSource={data} columns={columns} rowKey="id" style={{width:'80%', paddingTop:'2%'}} />
      {selectedData && (
        <InvoiceDetailsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          invoice={JSON.parse(selectedData.internal_format)}
        />
      )}</center>
    </div>
  );
};

export default ViewInvoice;
