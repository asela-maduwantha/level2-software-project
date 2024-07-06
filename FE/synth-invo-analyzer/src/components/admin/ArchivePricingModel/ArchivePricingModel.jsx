import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message } from "antd";
import HTTPService from "../../../Service/HTTPService";

const ArchivePricingModel = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchSubscriptionProducts();
  }, []);

  const fetchSubscriptionProducts = async () => {
    try {
      const response = await HTTPService.get("subscription-models/get_subscription_models/");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const handleArchive = async (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const confirmArchive = async () => {
    try {
      await HTTPService.post("subscription-models/archive_product/", {
        product_id: selectedProduct.stripe_id,
      });
      message.success("Product archived successfully.");
      setIsModalVisible(false);
      fetchSubscriptionProducts(); // Refresh the list
    } catch (error) {
      message.error("Failed to archive product.");
    }
  };

  const cancelArchive = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  const columns = [
    { title: 'Model Name',dataIndex: 'model_name',key: 'model_name',},
    { title: "Price", dataIndex: "model_price", key: "model_price" },
    { title: "Billing Period", dataIndex: "billing_period", key: "billing_period" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" danger onClick={() => handleArchive(record)}>
          Archive
        </Button>
      ),
    },
  ];

  return (
    <div>
        <br></br>
      <center><h2>Archive a your Model</h2></center><br></br>
      <Table dataSource={products} columns={columns} rowKey="id" />

      <Modal
        title="Archive Product"
        visible={isModalVisible}
        onOk={confirmArchive}
        onCancel={cancelArchive}
      >
        <p>Are you sure you want to archive this product?</p>
      </Modal>
    </div>
  );
};

export default ArchivePricingModel;
