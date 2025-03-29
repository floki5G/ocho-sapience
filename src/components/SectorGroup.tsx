import React, { useState } from 'react';
import { calculateSectorSummary, formatCurrency, formatPercentage, getGainLossClassName } from '@/utils/helpers';
import StockRow from './StockRow';
import { Portfolio, PortfolioStockData } from '@/types';
import { FaChevronDown, FaChevronUp, FaBuilding, FaPercentage, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

const SectorGroup = ({ sector, stockData, totalPortfolioInvestment }: {
  sector: Portfolio['sectors'][number];
  stockData: PortfolioStockData['stockData'] | object
  totalPortfolioInvestment: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { name, stocks } = sector;

  const summary = calculateSectorSummary(stocks, stockData);
  const { totalInvestment, totalPresentValue, totalGainLoss, gainLossPercentage } = summary;

  const gainLossClassName = getGainLossClassName(totalGainLoss);

  const sectorWeight = (totalInvestment / totalPortfolioInvestment) * 100;

  return (
    <div className="mb-8 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div
        className="bg-gradient-to-r from-gray-50 to-white p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <FaBuilding className="text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2">
            {formatPercentage(sectorWeight)}
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center text-gray-600 text-sm">
            <FaMoneyBillWave className="mr-1 text-indigo-500" />
            <span className="font-medium">Investment:</span>
            <span className="ml-1">{formatCurrency(totalInvestment)}</span>
          </div>

          <div className="hidden md:flex items-center text-gray-600 text-sm">
            <FaChartLine className="mr-1 text-emerald-500" />
            <span className="font-medium">Value:</span>
            <span className="ml-1">{formatCurrency(totalPresentValue)}</span>
          </div>

          <div className={`flex items-center text-sm ${gainLossClassName}`}>
            <FaPercentage className="mr-1" />
            <span className="font-medium">G/L:</span>
            <span className="ml-1">{formatCurrency(totalGainLoss)} ({formatPercentage(gainLossPercentage)})</span>
          </div>

          {isExpanded ? (
            <FaChevronUp className="text-gray-400 ml-2" />
          ) : (
            <FaChevronDown className="text-gray-400 ml-2" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Particulars
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investment
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Portfolio (%)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exchange
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CMP
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present Value
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gain/Loss
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P/E Ratio
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Latest Earnings
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stocks.map((stock) => (
                <StockRow
                  key={stock.symbol}
                  stock={stock}
                  stockData={stockData}
                  totalInvestment={totalPortfolioInvestment}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SectorGroup;