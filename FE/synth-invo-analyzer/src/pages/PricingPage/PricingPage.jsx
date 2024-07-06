import React, { useState, useEffect } from 'react';
import HTTPService from '../../Service/HTTPService';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header/Header';

const PricingPage = () => {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await HTTPService.get('subscription-models/get_subscription_models/');
        const models = response.data;

 
        const modelsWithFeatures = await Promise.all(models.map(async (model) => {
          const featuresResponse = await HTTPService.get(`subscription-models/get-features/${model.model_id}/`);
          return {
            ...model,
            features: featuresResponse.data.map(featureObj => featureObj.feature),
          };
        }));

        
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

  const handleGetAccess = (plan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/organization/signup', { state: { fromPricing: true, plan } });
    } else {
      navigate('/subscribe', { state: { plan } });
    }
  };

  return (
   <>
   <Header/>
    <div className="bg-gray-100 p-8 rounded-3xl max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Choose your plan</h1>
      <div className="flex items-center mb-6">
       
  
      </div>
      <p className="text-gray-600 mb-6">Get the right plan for your business. Plans can be upgraded in the future.</p>
      
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : pricingData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingData.map((plan, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md">
              <div className={`w-3 h-3 rounded-full bg-[#6760EF] mb-4`}></div>
              <h2 className="text-xl font-semibold mb-4">{plan.model_name}</h2>
              <div className="text-4xl font-bold mb-2">
                ${plan.model_price}
                <span className="text-sm font-normal text-gray-500">/ {plan.billing_period}</span>
              </div>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className={`mt-8 w-full py-3 px-4 rounded-lg ${
                  index === 1 ? 'bg-[#6760EF] text-white' : 'border border-[#6760EF] text-[#6760EF]'
                }`}
                onClick={() => handleGetAccess(plan)}
              >
                Get Plan
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No pricing data available</p>
      )}
    </div>
   </>
  );
};

export default PricingPage;