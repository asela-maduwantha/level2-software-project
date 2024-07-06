import React, { useState, useEffect } from 'react';
import { Card, Divider, Button, Modal } from 'antd';
import HTTPService from '../../../Service/HTTPService';
import fileDownload from 'js-file-download';

const { Meta } = Card;

const ViewTemplate = () => {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await HTTPService.get('invoice-template/get-supplier-template/', {
          params: {
            supplier_id: localStorage.getItem('supplier_id'), 
          },
        });
        setTemplate(response.data[0]);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTemplate();
  }, []);

  const handleViewMapping = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleDownloadTemplate = () => {
    if (template) {
      const blob = new Blob([template.template_content], { type: 'text/xml' });
      fileDownload(blob, `${template.template_name}`);
    }
  };

  const handleDownloadMapping = () => {
    if (template && template.mapping_dict) {
      const blob = new Blob([JSON.stringify(template.mapping_dict, null, 2)], { type: 'application/json' });
      fileDownload(blob, 'mapping.json');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
    <br></br>
      <h1 style={{ textAlign: 'center' }}>Template Of Invoices</h1><br></br>
      <div style={{ display: 'flex', height: '100vh', padding: '1rem' }}>
        <div style={{ flex: '1', height: '60vh', overflow: 'auto', marginRight: '1rem' }}>
          {template && (
            <Card title={template.template_name} style={{ width: '80%', height: '100%' }}>
              <Meta description={<pre>{template.template_content}</pre>} />
              <Divider />
              <p>Uploaded At: {new Date(template.uploaded_at).toLocaleString()}</p>
            </Card>
          )}
        </div>

        <div style={{ width: '200px', padding: '0 1rem' }}>
          <Button onClick={handleViewMapping} type="primary" style={{ marginBottom: '1rem', width: '100%' }}>View Mapping</Button>
          <Button onClick={handleDownloadTemplate} style={{ marginBottom: '1rem', width: '100%' }}>Download Template</Button>
          <Button onClick={handleDownloadMapping} style={{ width: '100%' }}>Download Mapping</Button>
        </div>

        <Modal
          title="Template Mapping"
          visible={showModal}
          onCancel={handleModalClose}
          footer={null}
        >
          {template && template.mapping_dict && (
            <pre>{JSON.stringify(template.mapping_dict, null, 2)}</pre>
          )}
        </Modal>
      </div>
    </>
  );
};

export default ViewTemplate;
