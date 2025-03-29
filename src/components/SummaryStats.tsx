import React from 'react';
import { formatCurrency, formatPercentage, getGainLossClassName } from '@/utils/helpers';
import { FaChartLine, FaMoneyBillWave, FaWallet, FaArrowUp, FaArrowDown, FaExchangeAlt } from 'react-icons/fa';

const SummaryStats = ({ summary }: {
  summary: {
    totalInvestment: number;
    totalPresentValue: number;
    totalGainLoss: number;
    gainLossPercentage: number;
  }
}) => {
  const { totalInvestment, totalPresentValue, totalGainLoss, gainLossPercentage } = summary;
  const gainLossClassName = getGainLossClassName(totalGainLoss);

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
        <FaChartLine className="w-5 h-5 mr-2 text-blue-500" />
        Portfolio Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500 font-medium">Total Investment</div>
            <FaMoneyBillWave className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold mt-2 text-gray-800">{formatCurrency(totalInvestment)}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500 font-medium">Present Value</div>
            <FaWallet className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold mt-2 text-gray-800">{formatCurrency(totalPresentValue)}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500 font-medium">Total Gain/Loss</div>
            <FaExchangeAlt className="w-5 h-5 text-blue-500" />
          </div>
          <div className={`text-2xl font-bold mt-2 flex items-center ${gainLossClassName}`}>
            {formatCurrency(totalGainLoss)}
            <span className="ml-2 text-lg">
              ({formatPercentage(gainLossPercentage)})
            </span>
            {totalGainLoss > 0 ? (
              <FaArrowUp className="w-4 h-4 ml-2" />
            ) : (
              <FaArrowDown className="w-4 h-4 ml-2" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;