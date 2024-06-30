import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubscriptionManagement = () => {
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const organizationId = localStorage.getItem('organization_id');

  // Fetch current subscription on component mount
  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/subscriptions/get-current-plan/?user_id=${organizationId}`);
        setCurrentSubscription(response.data);
      } catch (error) {
        console.error('Error fetching current subscription:', error);
      }
    };

    if (organizationId) {
      fetchCurrentSubscription();
    }
  }, [organizationId]);

  // Fetch available plans on component mount
  useEffect(() => {
    const fetchAvailablePlans = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/subscriptions/get-available-plans/');
        setAvailablePlans(response.data);
      } catch (error) {
        console.error('Error fetching available plans:', error);
      }
    };

    fetchAvailablePlans();
  }, []);

  // Handle plan change
  const handleChangePlan = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/subscriptions/change-plan/', {
        userId: organizationId,
        priceId: selectedPlan,
      });
      // Optionally, update UI or show a success message
      alert('Subscription plan changed successfully!');
    } catch (error) {
      console.error('Error changing subscription plan:', error);
      alert('Failed to change subscription plan.');
    }
  };

  if (!organizationId) {
    return <p>Organization ID not found. Please check your settings.</p>;
  }

  if (!currentSubscription || availablePlans.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Your Current Plan</h2>
      <p>Plan: {currentSubscription.plan_id}</p>
      <p>Status: {currentSubscription.status}</p>
      <p>Next Billing Date: {currentSubscription.next_billing_date}</p>

      <h3>Change Plan</h3>
      <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
        <option value="">Select a Plan</option>
        {availablePlans.map((plan) => (
          <option key={plan.id} value={plan.price_id}>
            {plan.model_name} - {plan.model_price} {plan.currency}
          </option>
        ))}
      </select>
      <button onClick={handleChangePlan}>Change Plan</button>
    </div>
  );
};

export default SubscriptionManagement;
