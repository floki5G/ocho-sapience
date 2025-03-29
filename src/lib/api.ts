import axios from 'axios';
import * as cheerio from 'cheerio';
import yahooFinance from 'yahoo-finance2';
// 5 minutes cache
const CACHE_DURATION = 300;
// 5 hours in milliseconds
const FAILURE_EXPIRY = 5 * 60 * 60 * 1000;

const failureCountStore: Record<string, { count: number; lastReset: number }> = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cacheStore: Record<string, { data: any; expiry: number }> = {};

function getFailureCount(symbol: string) {
    const failureData = failureCountStore[symbol] || { count: 0, lastReset: Date.now() };
    return failureData;
}

function setFailureCount(symbol: string, count: number) {
    failureCountStore[symbol] = { count, lastReset: Date.now() };
}

function shouldUseYahooFinance(symbol: string): boolean {
    const { count, lastReset } = getFailureCount(symbol);
    const now = Date.now();

    if (now - lastReset > FAILURE_EXPIRY) {
        setFailureCount(symbol, 0);
        return false;
    }

    return count >= 5;
}
function getCachedData(key: string) {
    const cached = cacheStore[key];
    return cached && cached.expiry > Date.now() ? cached.data : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cacheData(key: string, value: any, duration: number) {
    cacheStore[key] = { data: value, expiry: Date.now() + duration * 1000 };
}

export async function fetchStockPrice(symbol: string, exchange: string): Promise<number> {
    const subExchange = { NSE: 'NS', BSE: 'BO' };
    const subExchangeKey = subExchange[exchange as keyof typeof subExchange] || '';

    const cacheKey = `price_${symbol}_${exchange}`;

    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    if (shouldUseYahooFinance(symbol)) {
        return fetchFromYahoo(symbol, subExchangeKey, cacheKey);
    }

    const url = `https://finance.yahoo.com/quote/${symbol}${subExchangeKey ? `.${subExchangeKey}` : ''}`;

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const priceStr = $('*[data-testid="qsp-price"]').text().trim();
        const price = parseFloat(priceStr.replace(/,/g, ''));

        if (isNaN(price)) throw new Error(`Could not parse price for ${symbol}`);

        cacheData(cacheKey, price, CACHE_DURATION);
        setFailureCount(symbol, 0);
        return price;
    } catch (error) {
        console.error('Web scraping failed:', error);

        const { count } = getFailureCount(symbol);
        setFailureCount(symbol, count + 1);

        return fetchFromYahoo(symbol, subExchangeKey, cacheKey);
    }
}

async function fetchFromYahoo(symbol: string, subExchangeKey: string, cacheKey: string): Promise<number> {
    try {
        const quote = await yahooFinance.quote(`${symbol}${subExchangeKey ? `.${subExchangeKey}` : ''}`);
        const price = quote.regularMarketPrice;
        cacheData(cacheKey, price, CACHE_DURATION);
        return price || 0;
    } catch (apiError) {
        console.error('Yahoo Finance API also failed: ', apiError);
        throw new Error(`Failed to fetch stock price for ${symbol}`);
    }
}


export async function fetchFinancialData(symbol: string, exchange: string
) {
    try {
        const cachedData = getCachedData(`financial_${symbol}_${exchange}`);
        if (cachedData) {
            return cachedData;
        }

        const response = await axios.get(`https://www.google.com/finance/quote/${symbol}:${exchange}`);
        const $ = cheerio.load(response.data);

        let peRatio = null;
        let earnings = null;

        $('div.gyFHrc').each((_, element) => {
            const label = $(element).find('.mfs7Fc').text().trim();
            if (label.includes('P/E ratio')) {
                peRatio = parseFloat($(element).find('.P6K39c').text().trim());
            }
        });

        $('div.gyFHrc').each((_, element) => {
            const label = $(element).find('.mfs7Fc').text().trim();
            if (label.includes('EPS')) {
                earnings = parseFloat($(element).find('.jNipjJ').text().trim().replace('$', ''));
            }
        });

        const result = { peRatio, earnings };

        cacheData(`financial_${symbol}`, result, CACHE_DURATION);
        return result;
    } catch (error) {
        console.error(`Error fetching financial data for ${symbol}:`, error);
        return { peRatio: null, earnings: null };
    }
}

export async function fetchBatchStockData(stock: {
    symbol: string;
    exchange: string;
}[]) {

    const uniqueSymbols = stock
    const results:
        Record<string, { currentPrice: number | null; peRatio: number | null; earnings: number | null }>
        = {};

    await Promise.all(uniqueSymbols.map(async (symbol) => {
        try {
            const [price, financialData] = await Promise.all([
                fetchStockPrice(symbol.symbol, symbol.exchange).catch(() => null),
                fetchFinancialData(symbol.symbol, symbol.exchange).catch(() => ({ peRatio: null, earnings: null }))
            ]);

            results[symbol.symbol] = {
                currentPrice: price,
                peRatio: financialData.peRatio,
                earnings: financialData.earnings
            };
        } catch (error) {
            console.error(`Failed to fetch data for ${symbol}:`, error);
            results[symbol.symbol] = {
                currentPrice: null,
                peRatio: null,
                earnings: null
            };
        }
    }));

    return results;
}