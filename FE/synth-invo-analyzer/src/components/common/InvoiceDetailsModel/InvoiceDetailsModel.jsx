import React, { useState, useEffect } from 'react';
import { Modal, Typography, Row, Col, Divider, Table, Button } from 'antd';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../../assets/companylogo.jpeg';  // Assuming the logo is in the assets folder

const { Text, Title } = Typography;

const InvoiceDetailsModal = ({ visible, onClose, invoice }) => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (invoice && invoice.invoice && invoice.invoice.items) {
      const formatted = invoice.invoice.items.map((item, index) => ({
        key: index,
        description: item.description || 'N/A',
        quantity: item.quantity || 'N/A',
        unitPrice: item.unit_price || 'N/A',
        totalPrice: item.total_price || 'N/A',
      }));
      setDataSource(formatted);
    }
  }, [invoice]);

  const handleDownloadPDF = () => {
    if (!invoice || !invoice.invoice) return;

    const doc = new jsPDF();
    doc.addFont('Helvetica', 'Helvetica', 'normal');
    doc.setFont('Helvetica');

    // Add logo
    doc.addImage(logo, 'JPEG', 10, 10, 60, 60);
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);

    // Add styled "INVOICE" text
    const invoiceTextWidth = doc.getTextWidth('INVOICE DETAILS');
    const rectWidth = invoiceTextWidth + 20;
    const rectHeight = 15;
    const rectX = 100;  // Adjust X position
    const rectY = 10;   // Adjust Y position
    const borderRadius = 7;

    // Draw rounded rectangle
    doc.setFillColor(0, 128, 255);  // Blue background color
    doc.roundedRect(rectX, rectY, rectWidth, rectHeight, borderRadius, borderRadius, 'F');

    // Add text
    doc.setTextColor(255, 255, 255);  // White text color
    doc.text('INVOICE DETAILS', rectX + 10, rectY + 11);  // Adjust text position

    let yPos = 40;

    // Add Invoice Header
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`Invoice Number: ${invoice.invoice.header?.invoice_number || 'N/A'}`, 110, yPos);
    doc.text(`Invoice Date: ${invoice.invoice.header?.invoice_date || 'N/A'}`, 110, yPos + 10);
    doc.text(`Due Date: ${invoice.invoice.header?.due_date || 'N/A'}`, 110, yPos + 20);
    doc.text(`Currency: ${invoice.invoice.header?.currency || 'N/A'}`, 110, yPos + 30);
    yPos += 40;

    // Add Seller Information
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Seller Information`, 10, yPos);
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Company Name: ${invoice.invoice.seller?.company_name || 'N/A'}`, 10, yPos + 10);
    doc.text(`Address: ${invoice.invoice.seller?.address?.street || 'N/A'}, ${invoice.invoice.seller?.address?.city || 'N/A'}, ${invoice.invoice.seller?.address?.state || 'N/A'}, ${invoice.invoice.seller?.address?.zip_code || 'N/A'}, ${invoice.invoice.seller?.address?.country || 'N/A'}`, 10, yPos + 20);
    doc.text(`Contact Name: ${invoice.invoice.seller?.contact?.name || 'N/A'}`, 10, yPos + 30);
    doc.text(`Contact Phone: ${invoice.invoice.seller?.contact?.phone || 'N/A'}`, 10, yPos + 40);
    doc.text(`Contact Email: ${invoice.invoice.seller?.contact?.email || 'N/A'}`, 10, yPos + 50);
    yPos += 60;

    // Add Buyer Information
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Buyer Information`, 110, yPos - 60); // Align to the right side
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Company Name: ${invoice.invoice.buyer?.company_name || 'N/A'}`, 110, yPos - 50);
    doc.text(`Address: ${invoice.invoice.buyer?.address?.street || 'N/A'}, ${invoice.invoice.buyer?.address?.city || 'N/A'}, ${invoice.invoice.buyer?.address?.state || 'N/A'}, ${invoice.invoice.buyer?.address?.zip_code || 'N/A'}, ${invoice.invoice.buyer?.address?.country || 'N/A'}`, 110, yPos - 40);
    doc.text(`Contact Name: ${invoice.invoice.buyer?.contact?.name || 'N/A'}`, 110, yPos - 30);
    doc.text(`Contact Phone: ${invoice.invoice.buyer?.contact?.phone || 'N/A'}`, 110, yPos - 20);
    doc.text(`Contact Email: ${invoice.invoice.buyer?.contact?.email || 'N/A'}`, 110, yPos - 10);
    yPos += 10;

    // Add Items
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Items`, 10, yPos);
    yPos += 10;

    const data = [];
    dataSource.forEach((item, index) => {
      const rowData = [
        (index + 1).toString(), // SL
        item.description, // Product Description
        item.quantity, // Qty.
        `$${item.unitPrice.toFixed(2)}`, // Price
        `$${item.totalPrice.toFixed(2)}`, // Total
      ];
      data.push(rowData);
    });

    // Calculate summary values
    const subTotal = invoice.invoice.summary?.subtotal || 0;
    const taxRate = invoice.invoice.summary?.tax_rate || 0.2; // default 20% tax rate if not provided
    const taxAmount = invoice.invoice.summary?.tax_amount || 0;
    const discount = invoice.invoice.summary?.discount || 0;
    const totalAmount = invoice.invoice.summary?.total_amount || 0;

    // Add a table with headers and summary rows
    doc.autoTable({
      startY: yPos,
      head: [['SL', 'Product Description', 'Qty.', 'Price', 'Total']],
      body: [
        ...data,
        [{ content: '', colSpan: 5, styles: { fillColor: [240, 240, 240] } }],
        ['', '', '', 'Subtotal', `$${subTotal.toFixed(2)}`],
        ['', '', '', `Tax Rate (${(taxRate * 100).toFixed(2)}%)`, `$${taxAmount.toFixed(2)}`],
        ['', '', '', 'Discount', `$${discount.toFixed(2)}`],
        ['', '', '', 'Total Amount', `$${totalAmount.toFixed(2)}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [0, 128, 255], textColor: [255, 255, 255] },
      bodyStyles: { fontSize: 12 },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      showHead: 'firstPage', // Only show the header on the first page
      willDrawCell: function (data) {
        if (data.row.index > data.table.body.length - 5) {
          data.cell.styles.fillColor = [240, 240, 240]; // Apply different background for summary rows
        }
      },
      didDrawPage: function (data) {
        // Ensure that the table doesn't break across pages, if required
        if (data.pageCount > 1) {
          doc.setPage(data.pageCount);
        }
      },
    });

    yPos = doc.autoTableEndPosY() + 30;

    // Add Payment Instructions
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('bold');
    doc.text(`Payment Instructions`, 10, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Bank Name: ${invoice.invoice.payment_instructions?.bank_name || 'N/A'}`, 10, yPos);
    doc.text(`Account Number: ${invoice.invoice.payment_instructions?.account_number || 'N/A'}`, 10, yPos + 10);
    doc.text(`Routing Number: ${invoice.invoice.payment_instructions?.routing_number || 'N/A'}`, 10, yPos + 20);
    doc.text(`SWIFT: ${invoice.invoice.payment_instructions?.swift || 'N/A'}`, 10, yPos + 30);
    yPos += 60;

    // Add Notes
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Notes`, 10, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`${invoice.invoice.notes?.note || 'N/A'}`, 10, yPos);
    yPos += 30;

    // Add Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Page ${i} of ${pageCount}`, 180, doc.internal.pageSize.height - 10);
    }

    // Save the PDF
    doc.save(`invoice_${invoice.invoice.header?.invoice_number || 'unknown'}.pdf`);
  };

  return (
    <Modal
      title={`Invoice Details - ${invoice?.invoice?.header?.invoice_number}`}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="download" type="primary" onClick={handleDownloadPDF}>
          Download PDF
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={4}>Seller Information</Title>
          <Text strong>Company Name:</Text> {invoice?.invoice?.seller?.company_name || 'N/A'}
          <br />
          <Text strong>Address:</Text> {`${invoice?.invoice?.seller?.address?.street || ''}, ${invoice?.invoice?.seller?.address?.city || ''}, ${invoice?.invoice?.seller?.address?.state || ''}, ${invoice?.invoice?.seller?.address?.zip_code || ''}, ${invoice?.invoice?.seller?.address?.country || ''}`}
          <br />
          <Text strong>Contact Name:</Text> {invoice?.invoice?.seller?.contact?.name || 'N/A'}
          <br />
          <Text strong>Contact Phone:</Text> {invoice?.invoice?.seller?.contact?.phone || 'N/A'}
          <br />
          <Text strong>Contact Email:</Text> {invoice?.invoice?.seller?.contact?.email || 'N/A'}
        </Col>
        <Col span={24}>
          <Divider />
          <Title level={4}>Buyer Information</Title>
          <Text strong>Company Name:</Text> {invoice?.invoice?.buyer?.company_name || 'N/A'}
          <br />
          <Text strong>Address:</Text> {`${invoice?.invoice?.buyer?.address?.street || ''}, ${invoice?.invoice?.buyer?.address?.city || ''}, ${invoice?.invoice?.buyer?.address?.state || ''}, ${invoice?.invoice?.buyer?.address?.zip_code || ''}, ${invoice?.invoice?.buyer?.address?.country || ''}`}
          <br />
          <Text strong>Contact Name:</Text> {invoice?.invoice?.buyer?.contact?.name || 'N/A'}
          <br />
          <Text strong>Contact Phone:</Text> {invoice?.invoice?.buyer?.contact?.phone || 'N/A'}
          <br />
          <Text strong>Contact Email:</Text> {invoice?.invoice?.buyer?.contact?.email || 'N/A'}
        </Col>
      </Row>

      <Divider />

      <Table
        dataSource={dataSource}
        columns={[
          { title: 'Description', dataIndex: 'description', key: 'description' },
          { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
          { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice' },
          { title: 'Total Price', dataIndex: 'totalPrice', key: 'totalPrice' },
        ]}
        pagination={false}
      />

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Title level={4}>Payment Instructions</Title>
          <Text strong>Bank Name:</Text> {invoice?.invoice?.payment_instructions?.bank_name || 'N/A'}
          <br />
          <Text strong>Account Number:</Text> {invoice?.invoice?.payment_instructions?.account_number || 'N/A'}
          <br />
          <Text strong>Routing Number:</Text> {invoice?.invoice?.payment_instructions?.routing_number || 'N/A'}
          <br />
          <Text strong>SWIFT:</Text> {invoice?.invoice?.payment_instructions?.swift || 'N/A'}
        </Col>
        <Col span={12}>
          <Title level={4}>Summary</Title>
          <Text strong>Subtotal:</Text> ${invoice?.invoice?.summary?.subtotal?.toFixed(2) || 'N/A'}
          <br />
          <Text strong>Tax Rate:</Text> {`${(invoice?.invoice?.summary?.tax_rate || 0.2) * 100}%`}
          <br />
          <Text strong>Tax Amount:</Text> ${invoice?.invoice?.summary?.tax_amount?.toFixed(2) || 'N/A'}
          <br />
          <Text strong>Discount:</Text> ${invoice?.invoice?.summary?.discount?.toFixed(2) || 'N/A'}
          <br />
          <Text strong>Total Amount:</Text> ${invoice?.invoice?.summary?.total_amount?.toFixed(2) || 'N/A'}
        </Col>
      </Row>
    </Modal>
  );
};

export default InvoiceDetailsModal;
