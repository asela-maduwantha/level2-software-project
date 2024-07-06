import React, { useState, useEffect } from 'react';
import HTTPService from '../../../Service/HTTPService';
import { Card, Button, Typography, Row, Col, Spin, Alert, Tag, Descriptions, Statistic, Modal, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SubscriptionManagement = () => {
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const organizationId = localStorage.getItem('organization_id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subscriptionResponse, plansResponse] = await Promise.all([
          HTTPService.get(`subscriptions/get-current-plan/${organizationId}/`),
          HTTPService.get('subscriptions/get-available-plans/')
        ]);
        setCurrentSubscription(subscriptionResponse.data);
        setAvailablePlans(plansResponse.data);
      } catch (error) {
        setError('Error fetching subscription data');
        console.error(error);
        message.error('Failed to load subscription data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchData();
    } else {
      setError('Organization ID not found. Please check your settings.');
      setLoading(false);
      message.error('Organization ID not found. Please check your settings.');
    }
  }, [organizationId]);

  const handleChangePlan = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    if (selectedPlan) {
      try {
        await HTTPService.put('subscriptions/change-plan/', {
          userId: organizationId,
          priceId: selectedPlan.price_id,
        });
        message.success({
          content: 'Subscription plan changed successfully!',
          duration: 5,
          style: {
            marginTop: '20vh',
          },
        });
        // Refresh current subscription after changing
        const response = await HTTPService.get(`subscriptions/get-current-plan/${organizationId}/`);
        setCurrentSubscription(response.data);
      } catch (error) {
        console.error('Error changing subscription plan:', error);
        message.error({
          content: 'Failed to change subscription plan. Please try again.',
          duration: 5,
          style: {
            marginTop: '20vh',
          },
        });
      }
    }
    setIsModalVisible(false);
    setSelectedPlan(null);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedPlan(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f0f2f5' }}>
      <Title level={2} style={{ marginBottom: '20px', color: '#6760EF' }}>Your Subscription</Title>
      
      {currentSubscription && (
        <Card
          style={{
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={8}>
              <Card
                style={{
                  backgroundColor: '#6760EF',
                  color: 'white',
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
                bodyStyle={{ padding: '30px' }}
              >
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  {currentSubscription.subscription_model.model_name}
                </Title>
                <Statistic
                  value={currentSubscription.subscription_model.model_price}
                  prefix="$"
                  suffix={`/ ${currentSubscription.subscription_model.billing_period.toLowerCase()}`}
                  valueStyle={{ color: 'white', fontSize: '24px' }}
                />
                <Tag color="green" style={{ marginTop: '10px' }}>
                  {currentSubscription.status.toUpperCase()}
                </Tag>
              </Card>
            </Col>
            <Col xs={24} md={16}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Subscription ID">
                  {currentSubscription.subscription_id}
                </Descriptions.Item>
                <Descriptions.Item label="Start Date">
                  {formatDate(currentSubscription.start_date)}
                </Descriptions.Item>
                <Descriptions.Item label="Next Billing Date">
                  {formatDate(currentSubscription.next_billing_date)}
                </Descriptions.Item>
                <Descriptions.Item label="Auto Renewal">
                  {currentSubscription.auto_renewal ? (
                    <CheckCircleOutlined style={{ color: 'green' }} />
                  ) : (
                    <ClockCircleOutlined style={{ color: 'orange' }} />
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
          
          <div style={{ marginTop: '20px' }}>
            <Title level={4}>Plan Features:</Title>
            <Row gutter={[16, 16]}>
              {currentSubscription.subscription_model.features.map(feature => (
                <Col key={feature.id} xs={24} sm={12} md={8}>
                  <Card size="small">
                    <CheckCircleOutlined style={{ color: '#6760EF', marginRight: '8px' }} />
                    {feature.feature}
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Button type="primary" size="large" onClick={handleChangePlan} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
              Change Plan
            </Button>
          </div>
        </Card>
      )}

      <Modal
        title="Available Plans"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="change" type="primary" onClick={handleModalOk} disabled={!selectedPlan}>
            Change to Selected Plan
          </Button>,
        ]}
      >
        <Row gutter={[16, 16]}>
          {availablePlans.map(plan => (
            <Col key={plan.model_id} xs={24} sm={12}>
              <Card
                hoverable
                style={{
                  borderColor: selectedPlan?.model_id === plan.model_id ? '#6760EF' : undefined,
                  borderWidth: selectedPlan?.model_id === plan.model_id ? '2px' : '1px'
                }}
                onClick={() => setSelectedPlan(plan)}
              >
                <Title level={4}>{plan.model_name}</Title>
                <Statistic
                  value={plan.model_price}
                  prefix="$"
                  suffix={`/ ${plan.billing_period.toLowerCase()}`}
                  valueStyle={{ color: '#6760EF' }}
                />
                <ul>
                  {plan.features.map(feature => (
                    <li key={feature.id}>{feature.feature}</li>
                  ))}
                </ul>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>
    </div>
  );
};

export default SubscriptionManagement;