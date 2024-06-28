import React, { useState, useEffect } from "react";
import { Layout, Input, Button, Table, Modal, message, DatePicker } from "antd";
import axios from "axios";
import moment from "moment";

const { Content } = Layout;

const UserDashboard = () => {
  const [query, setQuery] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Function to fetch invoices
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const organization_id = localStorage.getItem("organization_id");
      const url = `http://localhost:8000/search/search-invoices?organization_id=${organization_id}`;
      const response = await axios.get(url);
      console.log(response.data.length)

      if (response.status === 200) {
        const extractedInvoices = response.data.map((item) => item._source);
        setInvoices(extractedInvoices);
      } else {
        message.error("Failed to fetch invoices. Please try again.");
        setInvoices([]);
      }
    } catch (error) {
      message.error("Failed to fetch invoices. Please try again.");
      setInvoices([]);
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle search with filters
  const handleSearch = async () => {
    setLoading(true);
    try {
      const organization_id = localStorage.getItem("organization_id");
      const startDateString = startDate ? startDate.format("YYYY-MM-DD") : "";
      const endDateString = endDate ? endDate.format("YYYY-MM-DD") : "";

      let url = `http://localhost:8000/search/search-invoices?organization_id=${organization_id}&query=${query}`;
      if (supplierName) url += `&supplier_name=${supplierName}`;
      if (startDateString) url += `&start_date=${startDateString}`;
      if (endDateString) url += `&end_date=${endDateString}`;

      const response = await axios.get(url);

      if (response.status === 200) {
        const extractedInvoices = response.data.map((item) => item._source);
        setInvoices(extractedInvoices);
      } else {
        message.error("Failed to fetch invoices. Please try again.");
        setInvoices([]);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          message.error(data.error);
        } else if (status === 404) {
          message.error("No invoices found matching the search criteria");
          setInvoices([]);
        } else {
          message.error("Failed to fetch invoices. Please try again.");
          setInvoices([]);
        }
      } else {
        message.error("Network error. Please try again.");
        setInvoices([]);
      }
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to show invoice details modal
  const showModal = (invoice) => {
    setSelectedInvoice(invoice);
    setModalVisible(true);
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedInvoice(null);
  };

  // Columns configuration for Ant Design Table component
  const columns = [
    {
      title: "#",
      dataIndex: "",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Invoice Number",
      dataIndex: "invoice_number",
      key: "invoice_number",
    },
    {
      title: "Invoice Date",
      dataIndex: "invoice_date",
      key: "invoice_date",
      render: (text) => moment(text).format("YYYY-MM-DD"),
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
      render: (text) => `$ ${text}`,
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

  // Columns configuration for items table within the modal
  const itemColumns = [
    {
      title: "#",
      dataIndex: "",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "20px" }}>
        <h1>Invoice Search</h1>
        <div style={{ marginBottom: "20px" }}>
          <Input
            placeholder="Enter product name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: "200px", marginRight: "10px" }}
          />
          <Input
            placeholder="Enter supplier name"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            style={{ width: "200px", marginRight: "10px" }}
          />
          <DatePicker
            placeholder="Start Date"
            style={{ marginRight: "10px" }}
            onChange={(date) => setStartDate(date)}
          />
          <DatePicker
            placeholder="End Date"
            style={{ marginRight: "10px" }}
            onChange={(date) => setEndDate(date)}
          />
          <Button type="primary" onClick={handleSearch} loading={loading}>
            Search
          </Button>
        </div>
        <Table columns={columns} dataSource={invoices} rowKey="_id" loading={loading} />
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
                <strong>Invoice Date:</strong>{" "}
                {moment(selectedInvoice.invoice_date).format("YYYY-MM-DD")}
              </p>
              <p>
                <strong>Due Date:</strong>{" "}
                {moment(selectedInvoice.due_date).format("YYYY-MM-DD")}
              </p>
              <p>
                <strong>Currency:</strong> {selectedInvoice.currency}
              </p>
              <p>
                <strong>Seller:</strong> {selectedInvoice.seller?.company_name}
              </p>
              <p>
                <strong>Seller Address:</strong>{" "}
                {selectedInvoice.seller?.address?.street},{" "}
                {selectedInvoice.seller?.address?.city}
              </p>
              <p>
                <strong>Buyer:</strong> {selectedInvoice.buyer?.company_name}
              </p>
              <p>
                <strong>Buyer Address:</strong>{" "}
                {selectedInvoice.buyer?.address?.street},{" "}
                {selectedInvoice.buyer?.address?.city}
              </p>
              <Table
                columns={itemColumns}
                dataSource={selectedInvoice.items}
                pagination={false}
                rowKey="description"
              />
              <p>
                <strong>Subtotal:</strong> {selectedInvoice.summary?.subtotal}
              </p>
              <p>
                <strong>Tax Rate:</strong> {selectedInvoice.summary?.tax_rate}
              </p>
              <p>
                <strong>Tax Amount:</strong>{" "}
                {selectedInvoice.summary?.tax_amount}
              </p>
              <p>
                <strong>Total Amount:</strong>{" "}
                {selectedInvoice.summary?.total_amount}
              </p>
              <p>
                <strong>Notes:</strong> {selectedInvoice.notes?.note}
              </p>
            </>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default UserDashboard;
