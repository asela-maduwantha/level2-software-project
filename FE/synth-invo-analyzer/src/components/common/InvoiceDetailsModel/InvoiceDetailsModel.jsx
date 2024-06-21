import React, { useState, useEffect } from 'react';
import { Modal, Typography } from 'antd';

const { Text } = Typography;

const InvoiceDetailsModal = ({ visible, onClose, invoice }) => {
  const [formattedItems, setFormattedItems] = useState([]);

  // Function to format items in the invoice
  const formatItems = () => {
    if (!invoice || !invoice.items) return;

    const formatted = invoice.items.map((item, index) => (
      <li key={index}>
        <strong>Description:</strong> {item.description}<br />
        <strong>Quantity:</strong> {item.quantity}<br />
        <strong>Unit Price:</strong> ${item.unit_price}<br />
        <strong>Total:</strong> ${item.total}<br />
      </li>
    ));

    setFormattedItems(formatted);
  };

  // Call formatItems when invoice changes
  useEffect(() => {
    formatItems();
  }, [invoice]);

  // Ensure invoice exists before rendering
  if (!invoice) {
    return null;
  }

  return (
    <Modal
      title="Invoice Details"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <p><strong>Invoice Number:</strong> {invoice.invoice_number || 'N/A'}</p>
      <p><strong>Date:</strong> {invoice.date || 'N/A'}</p>
      <p><strong>Due Date:</strong> {invoice.due_date || 'N/A'}</p>

      <hr />

      <h3>Seller Information:</h3>
      {invoice.seller ? (
        <>
          <p><strong>Company Name:</strong> {invoice.seller.company_name || 'N/A'}</p>
          <p><strong>Seller Address:</strong> {`${invoice.seller.address.street || ''}, ${invoice.seller.address.city || ''}, ${invoice.seller.address.state || ''}, ${invoice.seller.address.zip_code || ''}, ${invoice.seller.address.country || ''}`}</p>
          <p><strong>Contact Name:</strong> {invoice.seller.contact.name || 'N/A'}</p>
          <p><strong>Contact Email:</strong> {invoice.seller.contact.email || 'N/A'}</p>
        </>
      ) : (
        <Text type="danger">Seller information not available</Text>
      )}

      <hr />

      <h3>Buyer Information:</h3>
      {invoice.buyer ? (
        <>
          <p><strong>Company Name:</strong> {invoice.buyer.company_name || 'N/A'}</p>
          <p><strong>Buyer Address:</strong> {`${invoice.buyer.address.street || ''}, ${invoice.buyer.address.city || ''}, ${invoice.buyer.address.state || ''}, ${invoice.buyer.address.zip_code || ''}, ${invoice.buyer.address.country || ''}`}</p>
          <p><strong>Contact Name:</strong> {invoice.buyer.contact.name || 'N/A'}</p>
          <p><strong>Contact Email:</strong> {invoice.buyer.contact.email || 'N/A'}</p>
        </>
      ) : (
        <Text type="danger">Buyer information not available</Text>
      )}

      <hr />

      <h3>Items:</h3>
      {formattedItems.length > 0 ? (
        <ul>
          {formattedItems}
        </ul>
      ) : (
        <Text type="danger">No items available</Text>
      )}

      <hr />

      <p><strong>Subtotal:</strong> ${invoice.subtotal || 'N/A'}</p>
      <p><strong>Tax Rate:</strong> {invoice.tax ? `${invoice.tax.rate}%` : 'N/A'}</p>
      <p><strong>Tax Amount:</strong> ${invoice.tax ? invoice.tax.amount : 'N/A'}</p>
      <p><strong>Total:</strong> ${invoice.total || 'N/A'}</p>

      <hr />

      <p><strong>Payment Terms:</strong> {invoice.payment_terms || 'N/A'}</p>
      <p><strong>Notes:</strong> {invoice.notes || 'N/A'}</p>
    </Modal>
  );
};

export default InvoiceDetailsModal;
