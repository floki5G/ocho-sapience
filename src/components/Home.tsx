import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortfolioTable from './PortfolioTable';
import { Portfolio, PortfolioStockData } from '@/types';
import SummaryStatsSkeleton from '@/skeleton/SummaryStatsSkeleton';
import SectorGroupSkeleton from '@/skeleton/SectorGroupSkeleton';
import { RiRefreshLine, RiLoader5Line } from "react-icons/ri";
import { mockPortfolioData } from '@/data/dummyPortfolio';

const HomeComponent = () => {
  const [portfolioData] = useState<Portfolio>(mockPortfolioData);
  const [stockData, setStockData] = useState<PortfolioStockData['stockData'] | object>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const getAllSymbols = () => {
    const symbols: {
      symbol: string;
      exchange: string;
    }[] = [];
    portfolioData.sectors.forEach(sector => {
      sector.stocks.forEach(stock => {
        symbols.push(stock);
      });
    });
    return symbols
  };

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const symbols = getAllSymbols();

      const response = await axios.post('/api/stocks', { symbols });
      setStockData(response.data.stockData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to fetch current stock data. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();

    const intervalId = setInterval(fetchStockData, 15000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          OCHO Sapience
        </h1>
        <div className="flex justify-between items-center text-sm">
          <p className="text-gray-600">
            {lastUpdated ? (
              <>Last updated: {lastUpdated.toLocaleTimeString()}</>
            ) : (
              <>Loading data...</>
            )}
          </p>
          <button
            onClick={fetchStockData}
            disabled={loading}
            className={`
    px-4 py-2 bg-gray-900 text-white rounded-lg font-medium
    hover:bg-gray-800 active:bg-gray-700 disabled:opacity-70
    disabled:cursor-not-allowed transition-all
    flex items-center justify-center
    shadow-sm hover:shadow-md
  `}
          >
            {loading ? (
              <RiLoader5Line className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <RiRefreshLine className="w-5 h-5 mr-2" />
            )}
            <span className="text-sm">{loading ? "Refreshing..." : "Refresh Data"}</span>
          </button>
        </div>
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4">
            <p>{error}</p>
          </div>
        )}
      </header>

      <main>
        {loading && stockData && Object.keys(stockData).length === 0 ? (
          <div className="w-full">
            <SummaryStatsSkeleton />
            <SectorGroupSkeleton />
          </div>
        ) : (
          <PortfolioTable portfolioData={portfolioData} stockData={stockData} />
        )}
      </main>
    </div>
  );
};

export default HomeComponent;