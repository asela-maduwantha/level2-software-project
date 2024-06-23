import React, { useState } from "react";
import { Layout, Input, Button, Table, Modal, message } from "antd";
import axios from "axios";

const { Header, Content } = Layout;

const UserDashboard = () => {
  const [query, setQuery] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const organization_id = localStorage.getItem("organization_id");
      const response = await axios.get(
        `http://localhost:8000/search/search-invoices?organization_id=${organization_id}&query=${query}`
      );

      if (response.status === 200) {
        const extractedInvoices = response.data.map((item) => item._source);
        setInvoices(extractedInvoices);
        console.log(extractedInvoices);
      } else {
        message.error("Failed to fetch invoices. Please try again.");
        setInvoices([]); // Clear invoices if there's an error
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          message.error(data.error);
        } else if (status === 404) {
          message.error("No invoices found matching the search criteria");
          setInvoices([]); // Clear invoices if no results found
        } else {
          message.error("Failed to fetch invoices. Please try again.");
          setInvoices([]); // Clear invoices for any other errors
        }
      } else {
        message.error("Network error. Please try again.");
        setInvoices([]); // Clear invoices for network errors
      }
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (invoice) => {
    setSelectedInvoice(invoice);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedInvoice(null);
  };

  const columns = [
    {
      title: "Invoice Number",
      dataIndex: "invoice_number",
      key: "invoice_number",
    },
    {
      title: "Invoice Date",
      dataIndex: "invoice_date",
      key: "invoice_date",
    },
    {
      title: "Seller",
      dataIndex: ["seller", "company_name"],
      key: "seller",
      render: (text, record) => (
        <>
          <div>{record.seller?.company_name}</div>
          <div>{record.seller?.address?.city}</div>
        </>
      ),
    },
    {
      title: "Buyer",
      dataIndex: ["buyer", "company_name"],
      key: "buyer",
      render: (text, record) => (
        <>
          <div>{record.buyer?.company_name}</div>
          <div>{record.buyer?.address?.city}</div>
        </>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: ["summary", "total_amount"],
      key: "total_amount",
      render: (text) => `£ ${text}`,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="link" onClick={() => showModal(record)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#001529", textAlign: "center", color: "#fff" }}>
        <h1>Invoice Search</h1>
      </Header>
      <Content style={{ padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <Input
            placeholder="Enter invoice description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: "300px", marginRight: "10px" }}
          />
          <Button type="primary" onClick={handleSearch} loading={loading}>
            Search
          </Button>
        </div>
        <Table columns={columns} dataSource={invoices} rowKey="_id" />
        <Modal
          title={`Invoice Details - ${selectedInvoice ? selectedInvoice.invoice_number : ""}`}
          visible={modalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Close
            </Button>,
          ]}
        >
          {selectedInvoice && (
            <>
              <p>
                <strong>Invoice Date:</strong> {selectedInvoice.invoice_date}
              </p>
              <p>
                <strong>Due Date:</strong> {selectedInvoice.due_date}
              </p>
              <p>
                <strong>Currency:</strong> {selectedInvoice.currency}
              </p>
              <p>
                <strong>Seller:</strong> {selectedInvoice.seller?.company_name}
              </p>{" "}
             
              <p>
                <strong>Seller Address:</strong>{" "}
                {selectedInvoice.seller?.address?.street},{" "}
                {selectedInvoice.seller?.address?.city}
              </p>{" "}
              
              <p>
                <strong>Buyer:</strong> {selectedInvoice.buyer?.company_name}
              </p>{" "}
              
              <p>
                <strong>Buyer Address:</strong>{" "}
                {selectedInvoice.buyer?.address?.street},{" "}
                {selectedInvoice.buyer?.address?.city}
              </p>{" "}
              
              <p>
                <strong>Total Amount:</strong> £ {selectedInvoice.summary?.total_amount}
              </p>{" "}
             
            </>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default UserDashboard;
