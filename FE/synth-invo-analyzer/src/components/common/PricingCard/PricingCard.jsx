// PricingCard.js
import React from 'react';
import List from '../../common/List/List';

const PricingCard = ({ title, price, features, buttonText, onClick }) => {
  return (
    <div className="p-8 text-center bg-white border border-purple-500 w-80 rounded-2xl">
      <div className="p-2 text-center bg-[#6760ef] w-[184px] h-[78px] rounded-2xl ml-9">
        <h1 className="text-base font-bold text-white text-[24px]">{title}</h1>
        <p className='text-white text-20 font-regular text-[20px]'>{price}</p>
      </div>
      <div className="pt-8">
        <p className="text-left text-black text-20 font-regular">Get {title === 'Free' ? 'the basic' : 'additional'} features:</p>
        <ul className="flex flex-col items-start pt-5 space-y-1 text-left font-regular text-[16px]">
          {features.map((feature, index) => (
            <List key={index} text={feature} />
          ))}
        </ul>
        <button onClick={onClick} className="py-2 mt-4 text-white bg-[#6760ef] px-11 rounded-3xl hover:bg-[#6760ef] text-xs">{buttonText}</button>
      </div>
    </div>
  );
};

export default PricingCard;
