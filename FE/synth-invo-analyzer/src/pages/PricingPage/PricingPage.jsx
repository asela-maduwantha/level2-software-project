import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/common/Header/Header';
import PricingCard from '../../components/common/PricingCard/PricingCard';
import { useNavigate } from 'react-router-dom';

function PricingPage() {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/subscription-models/get_subscription_models/');
        const models = response.data;

        // Fetch features for each model
        const modelsWithFeatures = await Promise.all(models.map(async (model) => {
          const featuresResponse = await axios.get(`http://127.0.0.1:8000/subscription-models/get-features/${model.model_id}/`);
          return {
            ...model,
            features: featuresResponse.data.map(featureObj => featureObj.feature), // Extract the feature property
          };
        }));

        // Sort models by price in ascending order
        modelsWithFeatures.sort((a, b) => a.model_price - b.model_price);

        setPricingData(modelsWithFeatures);
        setLoading(false);
      } catch (error) {
        console.error('Error occurred while fetching pricing data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGetAccess = async (priceId) => {
    localStorage.setItem("priceId", priceId);
    navigate('/organization/signup');
  };

  return (
    <div className="font-sans">
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div>
          <div className="text-center">
            <h1 className="font-semibold text-black text-[52px]">Pricing</h1>
            <p className="w-full px-8 pt-8 font-medium text-gray-800 text-[20px]">
              Getting Started to analyze Your Invoices with us.
              <br />
              Choose a plan that suits you!
            </p>
          </div>
          <div className="grid grid-cols-3 gap-40 mt-6">
            {loading ? (
              <p>Loading...</p>
            ) : pricingData.length > 0 ? (
              pricingData.map((pricing, index) => (
                <PricingCard
                  key={index}
                  title={pricing.model_name}
                  price={`$${pricing.model_price}`}
                  features={pricing.features}
                  buttonText="Get Access"
                  onClick={() => handleGetAccess(pricing.price_id)}
                />
              ))
            ) : (
              <p>No pricing data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
