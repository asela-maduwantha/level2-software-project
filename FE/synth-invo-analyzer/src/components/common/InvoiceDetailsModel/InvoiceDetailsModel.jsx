import React, { useState, useEffect } from 'react';
import { Modal, Typography, Row, Col, Divider, Table, Button } from 'antd';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { Text, Title } = Typography;

const InvoiceDetailsModal = ({ visible, onClose, invoice }) => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (invoice && invoice.Invoice && invoice.Invoice.Items) {
      const formatted = invoice.Invoice.Items.map((item, index) => ({
        key: index,
        description: item.Description || 'N/A',
        quantity: item.Quantity || 'N/A',
        unitPrice: item.UnitPrice || 'N/A',
        totalPrice: item.TotalPrice || 'N/A',
      }));
      setDataSource(formatted);
    }
  }, [invoice]);

  const handleDownloadPDF = () => {
    if (!invoice || !invoice.Invoice) return;

    const doc = new jsPDF();

    // Starting vertical position to place content
    let yPos = 20;

    // Add Invoice Title
    doc.setFontSize(20);
    doc.text('Invoice Details', 105, yPos, { align: 'center' });
    yPos += 10;

    // Add Invoice Header
    doc.setFontSize(14);
    doc.text(`Invoice Number: ${invoice.Invoice.Header?.InvoiceNumber || 'N/A'}`, 10, yPos);
    doc.text(`Invoice Date: ${invoice.Invoice.Header?.InvoiceDate || 'N/A'}`, 10, yPos + 10);
    doc.text(`Due Date: ${invoice.Invoice.Header?.DueDate || 'N/A'}`, 10, yPos + 20);
    doc.text(`Currency: ${invoice.Invoice.Header?.Currency || 'N/A'}`, 10, yPos + 30);
    yPos += 40;

    // Add Project Information
    doc.text(`Project Name: ${invoice.Invoice.Header?.ProjectName || 'N/A'}`, 10, yPos);
    yPos += 20;

    // Add Seller Information
    doc.text(`Seller Information`, 10, yPos);
    doc.text(`Company Name: ${invoice.Invoice.Seller?.CompanyName || 'N/A'}`, 10, yPos + 10);
    doc.text(`Address: ${invoice.Invoice.Seller?.Address?.Street || 'N/A'}, ${invoice.Invoice.Seller?.Address?.City || 'N/A'}, ${invoice.Invoice.Seller?.Address?.State || 'N/A'}, ${invoice.Invoice.Seller?.Address?.ZipCode || 'N/A'}, ${invoice.Invoice.Seller?.Address?.Country || 'N/A'}`, 10, yPos + 20);
    doc.text(`Contact Name: ${invoice.Invoice.Seller?.Contact?.Name || 'N/A'}`, 10, yPos + 30);
    doc.text(`Contact Phone: ${invoice.Invoice.Seller?.Contact?.Phone || 'N/A'}`, 10, yPos + 40);
    doc.text(`Contact Email: ${invoice.Invoice.Seller?.Contact?.Email || 'N/A'}`, 10, yPos + 50);
    yPos += 60;

    // Add Buyer Information
    doc.text(`Buyer Information`, 10, yPos);
    doc.text(`Company Name: ${invoice.Invoice.Buyer?.CompanyName || 'N/A'}`, 10, yPos + 10);
    doc.text(`Address: ${invoice.Invoice.Buyer?.Address?.Street || 'N/A'}, ${invoice.Invoice.Buyer?.Address?.City || 'N/A'}, ${invoice.Invoice.Buyer?.Address?.State || 'N/A'}, ${invoice.Invoice.Buyer?.Address?.ZipCode || 'N/A'}, ${invoice.Invoice.Buyer?.Address?.Country || 'N/A'}`, 10, yPos + 20);
    doc.text(`Contact Name: ${invoice.Invoice.Buyer?.Contact?.Name || 'N/A'}`, 10, yPos + 30);
    doc.text(`Contact Phone: ${invoice.Invoice.Buyer?.Contact?.Phone || 'N/A'}`, 10, yPos + 40);
    doc.text(`Contact Email: ${invoice.Invoice.Buyer?.Contact?.Email || 'N/A'}`, 10, yPos + 50);
    yPos += 60;

    // Add Items
    doc.text(`Items`, 10, yPos);
    yPos += 10;

    // Example data for table
    const data = [];
    dataSource.forEach((item, index) => {
      const rowData = [
        item.description,
        item.quantity,
        `$${item.unitPrice}`,
        `$${item.totalPrice}`,
      ];
      data.push(rowData);
    });

    // Add a table with headers
    doc.autoTable({
      startY: yPos,
      head: [['Description', 'Quantity', 'Unit Price', 'Total Price']],
      body: data,
    });
    yPos = doc.autoTableEndPosY() + 10;

    // Add Summary
    doc.text(`Summary`, 10, yPos);
    yPos += 10;
    doc.text(`Subtotal: $${invoice.Invoice.Summary?.Subtotal || 'N/A'}`, 10, yPos);
    doc.text(`Tax Rate: ${invoice.Invoice.Summary?.TaxRate ? `${invoice.Invoice.Summary?.TaxRate * 100}%` : 'N/A'}`, 10, yPos + 10);
    doc.text(`Tax Amount: $${invoice.Invoice.Summary?.TaxAmount || 'N/A'}`, 10, yPos + 20);
    doc.text(`Total Amount: $${invoice.Invoice.Summary?.TotalAmount || 'N/A'}`, 10, yPos + 30);
    doc.text(`Discount: $${invoice.Invoice.Summary?.Discount || 'N/A'}`, 10, yPos + 40);
    yPos += 50;

    // Add Payment Instructions
    doc.text(`Payment Instructions`, 10, yPos);
    yPos += 10;
    doc.text(`Bank Name: ${invoice.Invoice.PaymentInstructions?.BankName || 'N/A'}`, 10, yPos);
    doc.text(`Account Number: ${invoice.Invoice.PaymentInstructions?.AccountNumber || 'N/A'}`, 10, yPos + 10);
    doc.text(`Routing Number: ${invoice.Invoice.PaymentInstructions?.RoutingNumber || 'N/A'}`, 10, yPos + 20);
    doc.text(`SWIFT: ${invoice.Invoice.PaymentInstructions?.SWIFT || 'N/A'}`, 10, yPos + 30);
    yPos += 40;

    // Add Notes
    doc.text(`Notes`, 10, yPos);
    yPos += 10;
    doc.text(`${invoice.Invoice.Notes?.Note || 'N/A'}`, 10, yPos);

    // Example: Save the PDF
    doc.save('invoice-details.pdf');
  };

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
      footer={[
        <Button key="pdf" onClick={handleDownloadPDF}>
          Download as PDF
        </Button>,
      ]}
      width={800}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'scroll' }}
    >
      <div>
        {/* Content displayed in the modal is already integrated into PDF */}
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
