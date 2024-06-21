import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SubscriptionForm from '../../components/common/SubscriptionForm/SubscriptionForm';

const stripePromise = loadStripe('pk_test_51OjbUfBbzgz8n85obaL5JQMnOfw0vX3p07cXLpXiHStUGaoGYHsLgxeN01oXwF6ka7m49z0AGDLJyeoAf1knQzn000wcVEBhuC');

const SubscriptionPage = () => {
  return (
    <div>
      <Elements stripe={stripePromise}>
      <SubscriptionForm />
    </Elements>
    </div>
  )
}

export default SubscriptionPage
