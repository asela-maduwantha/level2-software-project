import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import HTTPService from '../../../Service/HTTPService';

const SelectPlan = () => {
  const [subscriptionModels, setSubscriptionModels] = useState([]);

  useEffect(() => {
    const fetchSubscriptionModels = async () => {
      try {
        const response = await HTTPService.get('subscription-models/get_subscription_models/');
        setSubscriptionModels(response.data);
      } catch (error) {
        console.error('Error occurred while fetching subscription models:', error);
      }
    };

    fetchSubscriptionModels();
  }, []);

  const handleSelectPlan = async (priceId) => {
    try {
      const response = await HTTPService.post(
        'subscriptions/create-subscription/',
        {
          priceId: priceId,
        }
      );
      console.log(response.data);
      window.location.href = response.data;
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {subscriptionModels.map(model => (
        <Card key={model.model_id} style={{ width: 300, margin: '16px 0' }}>
          <p>{model.model_name}</p>
          <p>Price: ${model.model_price}</p>
          <Button type="primary" onClick={() => handleSelectPlan(model.price_id)}>Select Plan</Button>
        </Card>
      ))}
    </div>
  );
};

export default SelectPlan;
