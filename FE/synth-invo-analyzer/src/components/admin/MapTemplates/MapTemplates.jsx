import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, notification } from 'antd';
import HTTPService from '../../../Service/HTTPService';

const MapTemplates = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [templateContent, setTemplateContent] = useState('');

  useEffect(() => {
    HTTPService.get('invoice-template/get-unmapped-templates/')
      .then(response => {
        setData(response.data.unmapped_templates);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  const columns = [
    {
      title: 'No.',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Template Owner',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: 'Uploaded At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button onClick={() => showTemplateContent(record.template_content)}>View Template</Button>
          <Button onClick={() => downloadTemplateContent(record.template_content)} style={{ marginLeft: 8 }}>Download</Button>
          <Button onClick={() => handleUploadClick(record.id)} style={{ marginLeft: 8 }}>Upload Mapping</Button>
          <input
            type="file"
            id={`fileInput-${record.id}`}
            style={{ display: 'none' }}
            onChange={(event) => handleFileChange(event, record.id)}
          />
        </>
      ),
    },
  ];

  const showTemplateContent = (content) => {
    setTemplateContent(content);
    setVisible(true);
  };

  const downloadTemplateContent = (content) => {
    const blob = new Blob([content], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadClick = (templateId) => {
    const fileInput = document.getElementById(`fileInput-${templateId}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFileChange = (event, templateId) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('template_id', templateId);
      formData.append('mapping', file);
      formData.append('admin_id', localStorage.getItem('admin_id'));

      HTTPService.put('invoice-template/update-mapping/', formData)
        .then(response => {
          notification.success({
            message: 'Mapping Uploaded',
            description: 'Mapping has been successfully updated.',
            placement: 'topRight',
          });
        })
        .catch(error => {
          notification.error({
            message: 'Upload Error',
            description: 'There was an error uploading the mapping.',
            placement: 'topRight',
          });
        });
    }
  };

  return (
    <div>
      <Table columns={columns} dataSource={data} rowKey="id" />
      <Modal
        title="Template Content"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <pre>{templateContent}</pre>
      </Modal>
    </div>
  );
};

export default MapTemplates;
