import React, { useState, useEffect } from 'react';
import { Card, Divider, Button, Modal } from 'antd'; // Import Button and Modal from antd
import axios from 'axios';

const { Meta } = Card;

const ViewTemplate = () => {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapping, setMapping] = useState(null); // State to hold mapping data
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get('http://localhost:8000/invoice-template/get-template-by-supplier/', {
          params: {
            user_id: localStorage.getItem('supplier_id'), 
          },
        });
        setTemplate(response.data[0]);
        console.log(response.data[0])
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTemplate();
  }, []);

  const handleViewMapping = async () => {
    try {
      const response = await axios.get('http://localhost:8000/invoice-template/get-mapping-by-id/', {
        params: {
          user_id: localStorage.getItem('supplier_id'),
        },
      });
      const parsedMapping = JSON.parse(response.data);
      setMapping(parsedMapping);
      setShowModal(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleModalClose = () => {
    setMapping(null);
    setShowModal(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {template && (
        <Card title={template.template_name} style={{ width: 500, margin: 'auto' }}>
          <Meta description={template.template_content} />
          <Divider />
          <p>Uploaded At: {template.uploaded_at}</p>
          <Button onClick={handleViewMapping} type="primary" style={{ marginTop: '1rem' }}>View Mapping</Button>
        </Card>
      )}

   
      <Modal
        title="Template Mapping"
        visible={showModal}
        onCancel={handleModalClose}
        footer={null}
      >
        {mapping && (
          <pre>{JSON.stringify(mapping, null, 2)}</pre>
        )}
      </Modal>
    </div>
  );
};

export default ViewTemplate;
