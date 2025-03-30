import React, { memo } from 'react';
import {
  calculateInvestment,
  calculatePortfolioPercentage,
  calculatePresentValue,
  calculateGainLoss,
  calculateGainLossPercentage,
  formatCurrency,
  formatPercentage,
  getGainLossClassName
} from '@/utils';
import { Portfolio, PortfolioStockData } from '@/types';

const StockRow = memo(({ stock, stockData, totalInvestment }: {
  stock: Portfolio['sectors'][number]['stocks'][number]
  stockData: PortfolioStockData['stockData'] | object
  totalInvestment: number;
}) => {
  const { symbol, name, purchasePrice, quantity, exchange } = stock;

  const stockInfo = (stockData as PortfolioStockData['stockData'])[symbol] || {};
  const currentPrice = stockInfo.currentPrice || null;
  const peRatio = stockInfo.peRatio || null;
  const earnings = stockInfo.earnings || null;

  const investment = calculateInvestment(purchasePrice, quantity);
  const portfolioPercentage = calculatePortfolioPercentage(investment, totalInvestment);
  const presentValue = calculatePresentValue(currentPrice, quantity);
  const gainLoss = calculateGainLoss(presentValue, investment);
  const gainLossPercentage = calculateGainLossPercentage(gainLoss, investment);

  const gainLossClassName = getGainLossClassName(gainLoss);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm">{name}</td>
      <td className="px-4 py-3 text-sm text-right">{formatCurrency(purchasePrice)}</td>
      <td className="px-4 py-3 text-sm text-right">{quantity}</td>
      <td className="px-4 py-3 text-sm text-right">{formatCurrency(investment)}</td>
      <td className="px-4 py-3 text-sm text-right">{formatPercentage(portfolioPercentage)}</td>
      <td className="px-4 py-3 text-sm text-center">{exchange}</td>
      <td className="px-4 py-3 text-sm text-right font-medium">
        {currentPrice ? formatCurrency(currentPrice) : '-'}
      </td>
      <td className="px-4 py-3 text-sm text-right">
        {presentValue ? formatCurrency(presentValue) : '-'}
      </td>
      <td className={`px-4 py-3 text-sm text-right font-medium ${gainLossClassName}`}>
        {gainLoss !== null ? (
          <>
            {formatCurrency(gainLoss)}<br />
            <span className="text-xs">({formatPercentage(gainLossPercentage)})</span>
          </>
        ) : (
          '-'
        )}
      </td>
      <td className="px-4 py-3 text-sm text-right">
        {peRatio !== null ? peRatio.toFixed(2) : '-'}
      </td>
      <td className="px-4 py-3 text-sm text-right">
        {earnings !== null ? formatCurrency(earnings) : '-'}
      </td>
    </tr>
  );
});

StockRow.displayName = 'StockRow';

export default StockRow;