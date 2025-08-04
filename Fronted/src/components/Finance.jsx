// components/Finance.jsx
import { useState } from 'react';
import { FaCoins, FaMoneyCheckAlt, FaChartBar } from 'react-icons/fa';

const Finance = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  const financeItems = [
    {
      icon: <FaCoins className="text-purple-500 text-3xl" />,
      amount: "$ 10,000",
      label: "Total Payable"
    },
    {
      icon: <FaMoneyCheckAlt className="text-purple-500 text-3xl" />,
      amount: "$ 5,000",
      label: "Total Paid"
    },
    {
      icon: <FaChartBar className="text-purple-500 text-3xl" />,
      amount: "$ 300",
      label: "Others"
    }
  ];

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Finance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {financeItems.map((item, index) => (
          <div
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`cursor-pointer bg-white rounded-xl p-6 flex flex-col items-center justify-center shadow-md transition-all duration-200 border-2 ${
              activeIndex === index
                ? 'border-purple-500'
                : 'border-transparent hover:border-purple-300'
            }`}
          >
            {item.icon}
            <p className="text-lg font-bold mt-3">{item.amount}</p>
            <p className="text-sm text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Finance;