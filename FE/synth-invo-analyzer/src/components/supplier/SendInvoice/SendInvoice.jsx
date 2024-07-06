import React, { useState, useRef, useEffect } from "react";
import HTTPService from '../../../Service/HTTPService';
import { Button, Upload as AntUpload, notification, Select, Spin, Alert } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./SendInvoice.css"; 

const { Dragger } = AntUpload;
const { Option } = Select;

function SendInvoice() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const [recipient, setRecipient] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [templateExists, setTemplateExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("supplier_id");
      try {
        const response = await HTTPService.get(`auth/get-org-by-sup/`,{
          params :{
            supplier_id : userId
          }
      });
        setOrganizations(response.data.organizations);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    const checkTemplate = async () => {
      try {
        const response = await HTTPService.get("invoice-template/get-supplier-template/", {
          params: { supplier_id: localStorage.getItem("supplier_id") },
        });
       
        setTemplateExists(response.data.length > 0);
        console.log(templateExists)
      } catch (error) {
        console.error("Error checking template:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    checkTemplate();
  }, []);

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
    setUploadDisabled(files.length === 0);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("source_invoice", file);
    });
    formData.append("supplier_id", localStorage.getItem("supplier_id"));
    formData.append("organization_id", recipient);

    try {
      const token = localStorage.getItem("token");
      const response = await HTTPService.post("invoice/create_invoice/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        notification.success({
          message: "Upload Successful",
          duration: 3,
        });
        setSelectedFiles([]);
        setUploadDisabled(true);
      } else {
        notification.error({
          message: "Upload Failed",
          duration: 3,
        });
      }
    } catch (error) {
      notification.error({
        message: "Your invoice is not acceptable. Please contact admin.",
        duration: 3,
      });
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setUploadDisabled(false);
  };

  const handleRecipientChange = (value) => {
    setRecipient(value);
  };

  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  return (
    <div className="send-invoice-container">
      {templateExists ? (
        <div className="send-invoice-content">
          <h1 className="send-invoice-title">Send Your Invoices</h1>
          <div
            className="upload-area"
            onClick={handleAreaClick}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={handleFileDrop}
          >
            <Dragger
              fileList={selectedFiles}
              onChange={(info) => {
                const { status } = info.file;
                if (status !== "uploading") {
                  setSelectedFiles(info.fileList.map((file) => file.originFileObj));
                  setUploadDisabled(false);
                }
              }}
            >
              <p className="ant-upload-drag-icon larger-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text larger-text">Drop files here or click to select</p>
            </Dragger>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept=""
              onChange={handleFileInputChange}
              ref={fileInputRef}
            />
          </div>
          <div className="recipient-select larger-select">
            <Select
              placeholder="Select Recipient"
              style={{ width: 300 }}
              onChange={handleRecipientChange}
              value={recipient}
            >
              {organizations.map((org) => (
                <Option key={org.organization_id} value={org.organization_id}>
                  {org.organization_name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="action-buttons">
            <Button type="primary" size="large" onClick={() => fileInputRef.current.click()}>
              Select Files
            </Button>
            <Button type="primary" size="large" onClick={handleUpload} disabled={uploadDisabled}>
              Upload
            </Button>
          </div>
        </div>
      ) : (
        <div className="send-invoice-content">
          <Alert
            message="No Template Found"
            description="Please upload your template first."
            type="warning"
            showIcon
            style={{ marginBottom: 20 }}
          />
          <Button type="primary" size="large" onClick={() => navigate("/supplier/uploadtemplate")}>
            Upload Template
          </Button>
        </div>
      )}
    </div>
  );
}

export default SendInvoice;
