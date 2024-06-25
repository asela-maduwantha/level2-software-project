import React, { useState, useEffect } from 'react';
import { Modal, Typography, Row, Col, Divider, Table, Button } from 'antd';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../../assets/companylogo.png';  // Assuming the logo is in the assets folder

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
    doc.addFont('Helvetica', 'Helvetica', 'normal');
    doc.setFont('Helvetica');

    // Add logo
    doc.addImage(logo, 'JPEG', 10, 10, 50, 20);
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Invoice Details', 105, 20, { align: 'center' });

    let yPos = 40;

    // Add Invoice Header
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`Invoice Number: ${invoice.Invoice.Header?.InvoiceNumber || 'N/A'}`, 10, yPos);
    doc.text(`Invoice Date: ${invoice.Invoice.Header?.InvoiceDate || 'N/A'}`, 10, yPos + 10);
    doc.text(`Due Date: ${invoice.Invoice.Header?.DueDate || 'N/A'}`, 10, yPos + 20);
    doc.text(`Currency: ${invoice.Invoice.Header?.Currency || 'N/A'}`, 10, yPos + 30);
    yPos += 40;

    // Add Project Information
    doc.text(`Project Name: ${invoice.Invoice.Header?.ProjectName || 'N/A'}`, 10, yPos);
    yPos += 20;

    // Add Seller Information
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Seller Information`, 10, yPos);
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`Company Name: ${invoice.Invoice.Seller?.CompanyName || 'N/A'}`, 10, yPos + 10);
    doc.text(`Address: ${invoice.Invoice.Seller?.Address?.Street || 'N/A'}, ${invoice.Invoice.Seller?.Address?.City || 'N/A'}, ${invoice.Invoice.Seller?.Address?.State || 'N/A'}, ${invoice.Invoice.Seller?.Address?.ZipCode || 'N/A'}, ${invoice.Invoice.Seller?.Address?.Country || 'N/A'}`, 10, yPos + 20);
    doc.text(`Contact Name: ${invoice.Invoice.Seller?.Contact?.Name || 'N/A'}`, 10, yPos + 30);
    doc.text(`Contact Phone: ${invoice.Invoice.Seller?.Contact?.Phone || 'N/A'}`, 10, yPos + 40);
    doc.text(`Contact Email: ${invoice.Invoice.Seller?.Contact?.Email || 'N/A'}`, 10, yPos + 50);
    yPos += 60;

    // Add Buyer Information
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Buyer Information`, 10, yPos);
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`Company Name: ${invoice.Invoice.Buyer?.CompanyName || 'N/A'}`, 10, yPos + 10);
    doc.text(`Address: ${invoice.Invoice.Buyer?.Address?.Street || 'N/A'}, ${invoice.Invoice.Buyer?.Address?.City || 'N/A'}, ${invoice.Invoice.Buyer?.Address?.State || 'N/A'}, ${invoice.Invoice.Buyer?.Address?.ZipCode || 'N/A'}, ${invoice.Invoice.Buyer?.Address?.Country || 'N/A'}`, 10, yPos + 20);
    doc.text(`Contact Name: ${invoice.Invoice.Buyer?.Contact?.Name || 'N/A'}`, 10, yPos + 30);
    doc.text(`Contact Phone: ${invoice.Invoice.Buyer?.Contact?.Phone || 'N/A'}`, 10, yPos + 40);
    doc.text(`Contact Email: ${invoice.Invoice.Buyer?.Contact?.Email || 'N/A'}`, 10, yPos + 50);
    yPos += 60;

    // Add Items
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Items`, 10, yPos);
    yPos += 10;

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
      theme: 'grid',
      headStyles: { fillColor: [0, 128, 255] },
      styles: { fontSize: 12 },
    });
    yPos = doc.autoTableEndPosY() + 10;

    // Add Summary
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Summary`, 10, yPos);
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`Subtotal: $${invoice.Invoice.Summary?.Subtotal || 'N/A'}`, 10, yPos);
    doc.text(`Tax Rate: ${invoice.Invoice.Summary?.TaxRate ? `${invoice.Invoice.Summary?.TaxRate * 100}%` : 'N/A'}`, 10, yPos + 10);
    doc.text(`Tax Amount: $${invoice.Invoice.Summary?.TaxAmount || 'N/A'}`, 10, yPos + 20);
    doc.text(`Total Amount: $${invoice.Invoice.Summary?.TotalAmount || 'N/A'}`, 10, yPos + 30);
    doc.text(`Discount: $${invoice.Invoice.Summary?.Discount || 'N/A'}`, 10, yPos + 40);
    yPos += 50;

    // Add Payment Instructions
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Payment Instructions`, 10, yPos);
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`Bank Name: ${invoice.Invoice.PaymentInstructions?.BankName || 'N/A'}`, 10, yPos);
    doc.text(`Account Number: ${invoice.Invoice.PaymentInstructions?.AccountNumber || 'N/A'}`, 10, yPos + 10);
    doc.text(`Routing Number: ${invoice.Invoice.PaymentInstructions?.RoutingNumber || 'N/A'}`, 10, yPos + 20);
    doc.text(`SWIFT: ${invoice.Invoice.PaymentInstructions?.SWIFT || 'N/A'}`, 10, yPos + 30);
    yPos += 40;

    // Add Notes
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Notes`, 10, yPos);
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`${invoice.Invoice.Notes?.Note || 'N/A'}`, 10, yPos);

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
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="download" onClick={handleDownloadPDF}>
          Download PDF
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800}
    >
      <Title level={2}>Invoice Details</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Text strong>Invoice Number: </Text>
          <Text>{invoice.Invoice.Header?.InvoiceNumber || 'N/A'}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Invoice Date: </Text>
          <Text>{invoice.Invoice.Header?.InvoiceDate || 'N/A'}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Due Date: </Text>
          <Text>{invoice.Invoice.Header?.DueDate || 'N/A'}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Currency: </Text>
          <Text>{invoice.Invoice.Header?.Currency || 'N/A'}</Text>
        </Col>
      </Row>
      <Divider />
      <Row gutter={16}>
        <Col span={12}>
          <Title level={4}>Seller Information</Title>
          <Text strong>Company Name: </Text>
          <Text>{invoice.Invoice.Seller?.CompanyName || 'N/A'}</Text><br />
          <Text strong>Address: </Text>
          <Text>{invoice.Invoice.Seller?.Address?.Street || 'N/A'}, {invoice.Invoice.Seller?.Address?.City || 'N/A'}, {invoice.Invoice.Seller?.Address?.State || 'N/A'}, {invoice.Invoice.Seller?.Address?.ZipCode || 'N/A'}, {invoice.Invoice.Seller?.Address?.Country || 'N/A'}</Text><br />
          <Text strong>Contact Name: </Text>
          <Text>{invoice.Invoice.Seller?.Contact?.Name || 'N/A'}</Text><br />
          <Text strong>Contact Phone: </Text>
          <Text>{invoice.Invoice.Seller?.Contact?.Phone || 'N/A'}</Text><br />
          <Text strong>Contact Email: </Text>
          <Text>{invoice.Invoice.Seller?.Contact?.Email || 'N/A'}</Text>
        </Col>
        <Col span={12}>
          <Title level={4}>Buyer Information</Title>
          <Text strong>Company Name: </Text>
          <Text>{invoice.Invoice.Buyer?.CompanyName || 'N/A'}</Text><br />
          <Text strong>Address: </Text>
          <Text>{invoice.Invoice.Buyer?.Address?.Street || 'N/A'}, {invoice.Invoice.Buyer?.Address?.City || 'N/A'}, {invoice.Invoice.Buyer?.Address?.State || 'N/A'}, {invoice.Invoice.Buyer?.Address?.ZipCode || 'N/A'}, {invoice.Invoice.Buyer?.Address?.Country || 'N/A'}</Text><br />
          <Text strong>Contact Name: </Text>
          <Text>{invoice.Invoice.Buyer?.Contact?.Name || 'N/A'}</Text><br />
          <Text strong>Contact Phone: </Text>
          <Text>{invoice.Invoice.Buyer?.Contact?.Phone || 'N/A'}</Text><br />
          <Text strong>Contact Email: </Text>
          <Text>{invoice.Invoice.Buyer?.Contact?.Email || 'N/A'}</Text>
        </Col>
      </Row>
      <Divider />
      <Title level={4}>Items</Title>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <Divider />
      <Title level={4}>Summary</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Text strong>Subtotal: </Text>
          <Text>{`$${invoice.Invoice.Summary?.Subtotal || 'N/A'}`}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Tax Rate: </Text>
          <Text>{`${invoice.Invoice.Summary?.TaxRate ? invoice.Invoice.Summary?.TaxRate * 100 : 'N/A'}%`}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Tax Amount: </Text>
          <Text>{`$${invoice.Invoice.Summary?.TaxAmount || 'N/A'}`}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Total Amount: </Text>
          <Text>{`$${invoice.Invoice.Summary?.TotalAmount || 'N/A'}`}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Discount: </Text>
          <Text>{`$${invoice.Invoice.Summary?.Discount || 'N/A'}`}</Text>
        </Col>
      </Row>
      <Divider />
      <Title level={4}>Payment Instructions</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Text strong>Bank Name: </Text>
          <Text>{invoice.Invoice.PaymentInstructions?.BankName || 'N/A'}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Account Number: </Text>
          <Text>{invoice.Invoice.PaymentInstructions?.AccountNumber || 'N/A'}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Routing Number: </Text>
          <Text>{invoice.Invoice.PaymentInstructions?.RoutingNumber || 'N/A'}</Text>
        </Col>
        <Col span={12}>
          <Text strong>SWIFT: </Text>
          <Text>{invoice.Invoice.PaymentInstructions?.SWIFT || 'N/A'}</Text>
        </Col>
      </Row>
      <Divider />
      <Title level={4}>Notes</Title>
      <Text>{invoice.Invoice.Notes?.Note || 'N/A'}</Text>
    </Modal>
  );
};

export default InvoiceDetailsModal;
