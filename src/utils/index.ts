import { Portfolio, PortfolioStockData, Stock } from "@/types";

/**
 * Calculate investment amount (purchase price * quantity)
 * @param {number} price - Purchase price per share
 * @param {number} quantity - Number of shares
 * @returns {number} - Total investment amount
 */
export function calculateInvestment(price: number, quantity: number) {
    return price * quantity;
}

/**
 * Calculate portfolio percentage
 * @param {number} investment - Investment amount for a stock
 * @param {number} totalInvestment - Total investment amount for the entire portfolio
 * @returns {number} - Percentage of portfolio (rounded to 2 decimal places)
 */
export function calculatePortfolioPercentage(investment: number, totalInvestment: number) {
    if (totalInvestment === 0) return 0;
    return Number(((investment / totalInvestment) * 100).toFixed(2));
}

/**
 * Calculate present value based on current market price
 * @param {number} currentPrice - Current market price per share
 * @param {number} quantity - Number of shares
 * @returns {number} - Present value
 */
export function calculatePresentValue(currentPrice: number | null, quantity: number) {
    if (!currentPrice) return null;
    return currentPrice * quantity;
}

/**
 * Calculate gain/loss amount
 * @param {number} presentValue - Current value of the holding
 * @param {number} investment - Original investment amount
 * @returns {number} - Gain or loss amount
 */
export function calculateGainLoss(presentValue: number | null, investment: number) {
    if (presentValue === null) return null;
    return presentValue - investment;
}

/**
 * Calculate gain/loss percentage
 * @param {number} gainLoss - Gain or loss amount
 * @param {number} investment - Original investment amount
 * @returns {number} - Gain or loss percentage (rounded to 2 decimal places)
 */
export function calculateGainLossPercentage(gainLoss: number | null, investment: number) {
    if (gainLoss === null || investment === 0) return null;
    return Number(((gainLoss / investment) * 100).toFixed(2));
}

/**
 * Format currency values
 * @param {number} value - Number to format as currency
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(value: number) {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Format percentage values
 * @param {number} value - Number to format as percentage
 * @returns {string} - Formatted percentage string
 */
export function formatPercentage(value: number | null) {
    if (value === null || value === undefined) return '-';
    return `${value.toFixed(2)}%`;
}

/**
 * Get appropriate class name for gain/loss values
 * @param {number} value - Gain or loss value
 * @returns {string} - CSS class name
 */
export function getGainLossClassName(value: number | null) {
    if (value === null || value === undefined) return '';
    return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : '';
}

/**
 * Calculate sector summary statistics
 * @param {Array} stocks - Array of stocks in a sector
 * @param {Object} stockData - Real-time stock data
 * @returns {Object} - Sector summary statistics
 */
export function calculateSectorSummary(stocks: Stock[], stockData: PortfolioStockData['stockData'] | object) {
    if (!stocks || !stocks.length) {
        return {
            totalInvestment: 0,
            totalPresentValue: 0,
            totalGainLoss: 0,
            gainLossPercentage: 0
        };
    }

    let totalInvestment = 0;
    let totalPresentValue = 0;

    stocks.forEach((stock) => {
        const investment = calculateInvestment(stock.purchasePrice, stock.quantity);
        totalInvestment += investment;
        if (!stockData) {
            totalPresentValue += 0;
            return;
        }

        if (stockData && (stockData as PortfolioStockData['stockData'])[stock.symbol]) {
            const stockInfo = (stockData as PortfolioStockData['stockData'])[stock.symbol] || {};
            const presentValue = calculatePresentValue(stockInfo.currentPrice, stock.quantity);

            if (presentValue !== null) {
                totalPresentValue += presentValue;
            }
        }
    });

    const totalGainLoss = totalPresentValue - totalInvestment;
    const gainLossPercentage = totalInvestment > 0
        ? Number(((totalGainLoss / totalInvestment) * 100).toFixed(2))
        : 0;
    return {
        totalInvestment,
        totalPresentValue,
        totalGainLoss,
        gainLossPercentage
    };
}


export function calculatePortfolioSummary(sectors: Portfolio['sectors'], stockData: PortfolioStockData['stockData'] | object) {
    let allStocks:
        Stock[] = [];

    sectors.forEach(sector => {
        allStocks = [...allStocks, ...sector.stocks];
    });

    return calculateSectorSummary(allStocks, stockData);
}