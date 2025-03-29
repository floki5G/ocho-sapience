export type Stock = {
    symbol: string;
    name: string;
    exchange: string;
    purchasePrice: number;
    quantity: number;
    sector: string;
    currency: "INR" | "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "HKD" | "SGD" | "NZD" | "SEK" | "NOK" | "MXN" | "BRL" | "RUB" | "ZAR";

};

type Sector = {
    name: string;
    stocks: Stock[];
};

export type Portfolio = {
    sectors: Sector[];
};


type StockInfo = {
    currentPrice: number;
    peRatio: number | null;
    earnings: number | null;
};

type StockData = {
    [symbol: string]: StockInfo;
};

export type PortfolioStockData = {
    stockData: StockData;
};
