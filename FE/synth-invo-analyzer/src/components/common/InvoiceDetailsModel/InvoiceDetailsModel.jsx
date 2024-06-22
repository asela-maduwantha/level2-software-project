import React, { useState, useEffect } from 'react';
import { Modal, Typography, Row, Col, Divider, Table } from 'antd';

const { Text, Title } = Typography;

const InvoiceDetailsModal = ({ visible, onClose, invoice }) => {
  const [dataSource, setDataSource] = useState([]);

  const formatItems = () => {
    if (!invoice || !invoice.Invoice.Items) return;

    const formatted = invoice.Invoice.Items.map((item, index) => ({
      key: index,
      description: item.Description || 'N/A',
      quantity: item.Quantity || 'N/A',
      unitPrice: item.UnitPrice || 'N/A',
      totalPrice: item.TotalPrice || 'N/A',
    }));

    setDataSource(formatted);
  };

  useEffect(() => {
    formatItems();
  }, [invoice]);

  if (!invoice) {
    return null;
  }

  const columns = [
    {
      title: 'No.',
      key: 'no',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (text) => `$${text}`,
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text) => `$${text}`,
    },
  ];

  return (
    <Modal
      title="Invoice Details"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'scroll' }}
    >
      <div>
        <Title level={2} style={{ textAlign: 'center' }}>Invoice</Title>
        <Divider />

        <Row>
          <Col span={12}>
            <Title level={4}>Invoice Header</Title>
            <p><strong>Invoice Number:</strong> {invoice.Invoice.Header?.InvoiceNumber || 'N/A'}</p>
            <p><strong>Invoice Date:</strong> {invoice.Invoice.Header?.InvoiceDate || 'N/A'}</p>
            <p><strong>Due Date:</strong> {invoice.Invoice.Header?.DueDate || 'N/A'}</p>
            <p><strong>Currency:</strong> {invoice.Invoice.Header?.Currency || 'N/A'}</p>
          </Col>
          <Col span={12}>
            <Title level={4}>Project</Title>
            <p><strong>Project Name:</strong> {invoice.Invoice.Header?.ProjectName || 'N/A'}</p>
          </Col>
        </Row>
        <Divider />

        <Row>
          <Col span={12}>
            <Title level={4}>Seller Information</Title>
            <p><strong>Company Name:</strong> {invoice.Invoice.Seller?.CompanyName || 'N/A'}</p>
            <p>
              <strong>Address:</strong> {`${invoice.Invoice.Seller?.Address?.Street || ''}, ${invoice.Invoice.Seller?.Address?.City || ''}, ${invoice.Invoice.Seller?.Address?.State || ''}, ${invoice.Invoice.Seller?.Address?.ZipCode || ''}, ${invoice.Invoice.Seller?.Address?.Country || ''}`}
            </p>
            <p><strong>Contact Name:</strong> {invoice.Invoice.Seller?.Contact?.Name || 'N/A'}</p>
            <p><strong>Contact Phone:</strong> {invoice.Invoice.Seller?.Contact?.Phone || 'N/A'}</p>
            <p><strong>Contact Email:</strong> {invoice.Invoice.Seller?.Contact?.Email || 'N/A'}</p>
          </Col>
          <Col span={12}>
            <Title level={4}>Buyer Information</Title>
            <p><strong>Company Name:</strong> {invoice.Invoice.Buyer?.CompanyName || 'N/A'}</p>
            <p>
              <strong>Address:</strong> {`${invoice.Invoice.Buyer?.Address?.Street || ''}, ${invoice.Invoice.Buyer?.Address?.City || ''}, ${invoice.Invoice.Buyer?.Address?.State || ''}, ${invoice.Invoice.Buyer?.Address?.ZipCode || ''}, ${invoice.Invoice.Buyer?.Address?.Country || ''}`}
            </p>
            <p><strong>Contact Name:</strong> {invoice.Invoice.Buyer?.Contact?.Name || 'N/A'}</p>
            <p><strong>Contact Phone:</strong> {invoice.Invoice.Buyer?.Contact?.Phone || 'N/A'}</p>
            <p><strong>Contact Email:</strong> {invoice.Invoice.Buyer?.Contact?.Email || 'N/A'}</p>
          </Col>
        </Row>
        <Divider />

        <Title level={4}>Items</Title>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
        <Divider />

        <Title level={4}>Summary</Title>
        <p><strong>Subtotal:</strong> ${invoice.Invoice.Summary?.Subtotal || 'N/A'}</p>
        <p><strong>Tax Rate:</strong> {invoice.Invoice.Summary?.TaxRate ? `${invoice.Invoice.Summary?.TaxRate * 100}%` : 'N/A'}</p>
        <p><strong>Tax Amount:</strong> ${invoice.Invoice.Summary?.TaxAmount || 'N/A'}</p>
        <p><strong>Total Amount:</strong> ${invoice.Invoice.Summary?.TotalAmount || 'N/A'}</p>
        <p><strong>Discount:</strong> ${invoice.Invoice.Summary?.Discount || 'N/A'}</p>
        <Divider />

        <Title level={4}>Payment Instructions</Title>
        <p><strong>Bank Name:</strong> {invoice.Invoice.PaymentInstructions?.BankName || 'N/A'}</p>
        <p><strong>Account Number:</strong> {invoice.Invoice.PaymentInstructions?.AccountNumber || 'N/A'}</p>
        <p><strong>Routing Number:</strong> {invoice.Invoice.PaymentInstructions?.RoutingNumber || 'N/A'}</p>
        <p><strong>SWIFT:</strong> {invoice.Invoice.PaymentInstructions?.SWIFT || 'N/A'}</p>
        <Divider />

        <Title level={4}>Notes</Title>
        <p>{invoice.Invoice.Notes?.Note || 'N/A'}</p>
      </div>
    </Modal>
  );
};

export default InvoiceDetailsModal;
