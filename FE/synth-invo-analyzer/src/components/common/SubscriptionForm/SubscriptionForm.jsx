import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Form, Input, Select, Button, Typography, Space, message } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import HTTPService from '../../../Service/HTTPService';

const { Title, Text } = Typography;
const { Option } = Select;

const SubscriptionForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { plan } = location.state || {};

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  if (!plan) {
    navigate('/pricing');
    return null;
  }

  const onFinish = async (values) => {
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: values.cardholderName,
          email: values.email,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      const response = await HTTPService.post('subscriptions/create-subscription/', {
        priceId: plan.price_id,
        paymentMethodId: paymentMethod.id,
        email: values.email,
        organizationId : localStorage.getItem('organization_id')
      });

      if (response.data.status === 'success') {
        message.success('Subscription created successfully!');
        navigate('/organization/dashboard'); 
      } else {
        throw new Error(response.data.message || 'Subscription creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error(error.message || 'An error occurred while processing your subscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '20px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <Space direction="vertical" size="small" style={{ display: 'flex' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            <span style={{ color: '#3366cc' }}>Synth Invo Analyzer</span>
            <Text style={{ fontSize: '12px', backgroundColor: '#ffd700', padding: '2px 5px', marginLeft: '10px' }}>TEST MODE</Text>
          </Title>
        </div>
        <Text strong>Subscribe to {plan.model_name}</Text>
        <Title level={3} style={{ margin: 0 }}>
          ${plan.model_price} <Text style={{ fontSize: '14px', fontWeight: 'normal' }}>per month</Text>
        </Title>
      </Space>

      <Form layout="vertical" onFinish={onFinish} initialValues={{ email }} style={{ marginTop: '20px' }}>
        <Text strong>Pay with card</Text>
        <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>

        <Text strong>Card information</Text>
        <Form.Item>
          <div style={{ border: '1px solid #d9d9d9', padding: '10px', borderRadius: '4px' }}>
            <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
          </div>
        </Form.Item>

        <Form.Item name="cardholderName" rules={[{ required: true }]}>
          <Input placeholder="Cardholder name" />
        </Form.Item>

     

        <Form.Item name="zip" rules={[{ required: true }]}>
          <Input placeholder="ZIP" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block icon={<CreditCardOutlined />}>
            Subscribe
          </Button>
        </Form.Item>
      </Form>

      <Text style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>
        By confirming your subscription, you allow BoltVideos to charge your card for this payment and future payments in accordance with their terms. You can always cancel your subscription.
      </Text>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Text style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>
          Powered by <span style={{ fontWeight: 'bold' }}>stripe</span>
        </Text>
      </div>
    </div>
  );
};

export default SubscriptionForm;
