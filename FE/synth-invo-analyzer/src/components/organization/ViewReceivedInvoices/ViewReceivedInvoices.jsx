import React, { useState, useEffect } from 'react';
import { Table, Modal, Typography } from 'antd';
import HTTPService from '../../../Service/HTTPService';
import InvoiceDetailsModal from '../../common/InvoiceDetailsModel/InvoiceDetailsModel';

const { Title } = Typography;

const ViewReceivedInvoices = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const organization_id = localStorage.getItem('organization_id'); 
      const response = await HTTPService.get(`invoice/get-invoice-by-organization/?orgId=${organization_id}`);
      const sortedData = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); 
      setData(sortedData);
      console.log(data)
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
      title: 'Supplier',
      dataIndex: 'issuer_name',
      key: 'supplier',
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
        <h1>Your Invoices</h1>
        
        <Table dataSource={data} columns={columns} rowKey="id" style={{ width: '80%', paddingTop: '2%' }} />
        {selectedData && (
          <InvoiceDetailsModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            invoice={JSON.parse(selectedData.internal_format)}
            supplierLogoUrl = {selectedData.supplier_logo_url}
          />
        )}
      </center>
    </div>
  );
};

export default ViewReceivedInvoices;
