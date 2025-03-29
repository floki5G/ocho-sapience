import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables, ChartOptions } from 'chart.js';
import { Portfolio, PortfolioStockData } from "@/types";
import {
    calculateInvestment,
    calculatePortfolioPercentage,
    calculatePresentValue,
    calculateGainLoss,
    calculateGainLossPercentage,
} from "@/utils/helpers";

Chart.register(...registerables);

export const CHART_THEMES = {
    DEFAULT: {
        investment: { backgroundColor: "rgba(99, 102, 241, 0.7)", borderColor: "rgba(79, 70, 229, 1)" },        // Indigo
        presentValue: { backgroundColor: "rgba(16, 185, 129, 0.7)", borderColor: "rgba(5, 150, 105, 1)" },     // Emerald
        gainPositive: { backgroundColor: "rgba(34, 197, 94, 0.6)", borderColor: "rgba(22, 163, 74, 1)" },      // Green
        gainNegative: { backgroundColor: "rgba(239, 68, 68, 0.6)", borderColor: "rgba(220, 38, 38, 1)" },      // Red
    },
    DARK: {
        investment: { backgroundColor: "rgba(129, 140, 248, 0.7)", borderColor: "rgba(99, 102, 241, 1)" },     // Light Indigo
        presentValue: { backgroundColor: "rgba(52, 211, 153, 0.7)", borderColor: "rgba(16, 185, 129, 1)" },    // Teal
        gainPositive: { backgroundColor: "rgba(74, 222, 128, 0.6)", borderColor: "rgba(34, 197, 94, 1)" },      // Light Green
        gainNegative: { backgroundColor: "rgba(252, 165, 165, 0.6)", borderColor: "rgba(239, 68, 68, 1)" },    // Coral
    },
    MONOCHROME: {
        investment: { backgroundColor: "rgba(100, 116, 139, 0.7)", borderColor: "rgba(71, 85, 105, 1)" },      // Slate
        presentValue: { backgroundColor: "rgba(203, 213, 225, 0.7)", borderColor: "rgba(148, 163, 184, 1)" },  // Light Slate
        gainPositive: { backgroundColor: "rgba(71, 85, 105, 0.6)", borderColor: "rgba(30, 41, 59, 1)" },       // Dark Slate
        gainNegative: { backgroundColor: "rgba(226, 232, 240, 0.6)", borderColor: "rgba(203, 213, 225, 1)" },  // Extra Light Slate
    },
    CONTRAST: {  // New high-contrast theme
        investment: { backgroundColor: "rgba(79, 70, 229, 0.7)", borderColor: "rgba(55, 48, 163, 1)" },         // Dark Indigo
        presentValue: { backgroundColor: "rgba(5, 150, 105, 0.7)", borderColor: "rgba(4, 120, 87, 1)" },       // Dark Emerald
        gainPositive: { backgroundColor: "rgba(22, 163, 74, 0.6)", borderColor: "rgba(21, 128, 61, 1)" },      // Forest Green
        gainNegative: { backgroundColor: "rgba(220, 38, 38, 0.6)", borderColor: "rgba(185, 28, 28, 1)" },      // Dark Red
    }
};

export const CHART_VIEWS = {
    FULL: { showInvestment: true, showPresentValue: true, showGainLoss: true },
    INVESTMENT: { showInvestment: true, showPresentValue: false, showGainLoss: false },
    PRESENT_VALUE: { showInvestment: false, showPresentValue: true, showGainLoss: false },
    GAIN_LOSS: { showInvestment: false, showPresentValue: false, showGainLoss: true },
    COMPARISON: { showInvestment: true, showPresentValue: true, showGainLoss: false },
};

type ChartConfigOptions = {
    title?: string;
    subtitle?: string;
    theme?: keyof typeof CHART_THEMES;
    view?: keyof typeof CHART_VIEWS;
    showSummaryCards?: boolean;
    height?: string;
    sortBy?: 'investment' | 'presentValue' | 'gainLoss' | 'alphabetical' | 'none';
    sortDirection?: 'asc' | 'desc';
    maxStocks?: number;
    customOptions?: Partial<ChartOptions>;
};

const StockChart = ({
    sector,
    stockData,
    totalPortfolioInvestment,
    options = {}
}: {
    sector?: Portfolio["sectors"]
    stockData: PortfolioStockData["stockData"] | object;
    totalPortfolioInvestment: number;
    options?: ChartConfigOptions;
}) => {
    const {
        title = "Portfolio Performance",
        subtitle = "Investment vs. Current Value",
        theme = "DEFAULT",
        view = "FULL",
        height = "h-96",
        sortBy = 'investment',
        sortDirection = 'desc',
        maxStocks = 20,
        customOptions = {}
    } = options;

    const colors = CHART_THEMES[theme] || CHART_THEMES.DEFAULT;

    const viewConfig = CHART_VIEWS[view] || CHART_VIEWS.FULL;

    if (!Array.isArray(sector)) {
        console.error("sector is not an array", sector);
        return null;
    }

    const data = sector.flatMap((sec) => {
        if (!Array.isArray(sec.stocks)) return [];

        return sec.stocks.map((stock) => {
            const { symbol, name, purchasePrice, quantity, exchange } = stock;

            const stockInfo = (stockData as PortfolioStockData["stockData"])[symbol] || {};
            const currentPrice = stockInfo.currentPrice ?? purchasePrice; // Fallback to purchase price

            const investment = calculateInvestment(purchasePrice, quantity);
            const portfolioPercentage = calculatePortfolioPercentage(investment, totalPortfolioInvestment);
            const presentValue = calculatePresentValue(currentPrice, quantity);
            const gainLoss = calculateGainLoss(presentValue, investment);
            const gainLossPercentage = calculateGainLossPercentage(gainLoss, investment);

            return {
                symbol,
                name,
                purchasePrice,
                quantity,
                exchange,
                investment,
                portfolioPercentage,
                currentPrice,
                presentValue,
                gainLoss,
                gainLossPercentage,
            };
        });
    });

    if (data.length === 0) return (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">No stock data available</p>
        </div>
    );

    let sortedData = [...data];
    if (sortBy !== 'none') {
        sortedData.sort((a, b) => {
            let comparison = 0;

            if (sortBy === 'alphabetical') {
                comparison = a.symbol.localeCompare(b.symbol);
            } else {
                comparison = (b[sortBy] || 0) - (a[sortBy] || 0);
            }

            return sortDirection === 'asc' ? -comparison : comparison;
        });
    }

    sortedData = sortedData.slice(0, maxStocks);

    const datasets = [];

    if (viewConfig.showInvestment) {
        datasets.push({
            label: "Investment",
            data: sortedData.map((stock) => stock.investment),
            backgroundColor: colors.investment.backgroundColor,
            borderColor: colors.investment.borderColor,
            borderWidth: 1,
        });
    }

    if (viewConfig.showPresentValue) {
        datasets.push({
            label: "Present Value",
            data: sortedData.map((stock) => stock.presentValue),
            backgroundColor: colors.presentValue.backgroundColor,
            borderColor: colors.presentValue.borderColor,
            borderWidth: 1,
        });
    }

    if (viewConfig.showGainLoss) {
        datasets.push({
            label: "Gain/Loss",
            data: sortedData.map((stock) => stock.gainLoss),
            backgroundColor: sortedData.map((stock) =>
                (stock.gainLoss ?? 0) >= 0 ? colors.gainPositive.backgroundColor : colors.gainNegative.backgroundColor
            ),
            borderColor: sortedData.map((stock) =>
                (stock.gainLoss ?? 0) >= 0 ? colors.gainPositive.borderColor : colors.gainNegative.borderColor
            ),
            borderWidth: 1,
        });
    }

    const chartData = {
        labels: sortedData.map((stock) => `${stock.symbol} (${stock.name.substring(0, 12)}${stock.name.length > 12 ? '...' : ''})`),
        datasets: datasets,
    };

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    boxWidth: 12,
                    padding: 15,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context:
                        { dataset: { label: string }, parsed: { y: number | null } } &
                        { dataIndex: number; datasetIndex: number; chart: Chart }
                    ) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD'
                            }).format(context.parsed.y);
                        }
                        return label;
                    },
                    afterLabel: function (context: {
                        dataset: { label: string };
                        dataIndex: number;
                        chart: Chart;
                    }) {
                        if (context.dataset.label === "Gain/Loss") {
                            const stockIndex = context.dataIndex;
                            return `${(sortedData[stockIndex].gainLossPercentage ?? 0).toFixed(2)}%`;
                        }
                        return undefined;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    callback: function (value: string | number | bigint) {
                        if (typeof value === 'number' || typeof value === 'bigint') {
                            return new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                maximumFractionDigits: 0
                            }).format(value);
                        }
                        return value.toString();
                    }
                }
            }
        },
    };

    const mergedOptions = {
        ...defaultOptions,
        ...customOptions,
        plugins: {
            ...defaultOptions.plugins,
            ...(customOptions.plugins || {}),
        },
        scales: {
            ...defaultOptions.scales,
            ...(customOptions.scales || {}),
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
            <div className={height}>
                {/* @ts-expect-error: Chart.js types do not fully align with react-chartjs-2 types */}
                <Bar data={chartData} options={mergedOptions} />
            </div>

        </div>
    );
};

export default StockChart;