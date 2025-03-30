import React, { useState } from 'react';
import { calculatePortfolioSummary } from '@/utils';
import { Portfolio, PortfolioStockData } from '@/types';
import SectorGroup from './SectorGroup';
import SummaryStats from './SummaryStats';
import StockChart from './StockChart';

const PortfolioTable = ({
  portfolioData,
  stockData
}: {
  portfolioData: Portfolio;
  stockData: PortfolioStockData['stockData'] | object
}) => {
  const summary = calculatePortfolioSummary(portfolioData.sectors, stockData);

  const totalPortfolioInvestment = summary.totalInvestment;

  const [viewMode, setViewMode] = useState<'sectors' | 'chart'>('sectors');

  const [selectedSector, setSelectedSector] = useState(portfolioData.sectors[0]?.name || '');

  return (
    <div className="">
      <div className="mb-6">
        <SummaryStats summary={summary} />
      </div>

      {/* View mode toggle */}
      <div className="flex mb-6 justify-center items-center">
        <div className="inline-flex rounded-md shadow-sm bg-gray-100 p-1">
          <button
            onClick={() => setViewMode('sectors')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${viewMode === 'sectors'
              ? 'bg-black text-white'
              : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
          >
            Sector Breakdown
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${viewMode === 'chart'
              ? 'bg-black text-white'
              : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
          >
            Portfolio Chart
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'sectors' && (
        <div className="space-y-6">
          {portfolioData.sectors.map((sector) => (
            <SectorGroup
              key={sector.name}
              sector={sector}
              stockData={stockData}
              totalPortfolioInvestment={totalPortfolioInvestment}
            />
          ))}
        </div>
      )}

      {viewMode === 'chart' && (
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex flex-wrap gap-3 mb-4">
            {portfolioData.sectors.map((sector) => (
              <button
                key={sector.name}
                onClick={() => setSelectedSector(sector.name)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedSector === sector.name
                  ? 'bg-black text-white'
                  : 'bg-blue-100 text-black hover:bg-blue-200'
                  }`}
              >
                {sector.name}
              </button>
            ))}
          </div>
          {portfolioData.sectors.find((s) => s.name === selectedSector) && (
            <StockChart
              sector={portfolioData.sectors.filter((s) => s.name === selectedSector)}
              stockData={stockData}
              totalPortfolioInvestment={totalPortfolioInvestment}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioTable;