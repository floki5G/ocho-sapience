import { fetchBatchStockData } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function POST(request:
  Request
) {
  try {
    const { symbols } = await request.json();

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or missing symbols array' },
        { status: 400 }
      );
    }

    const limitedSymbols = symbols.slice(0, 50);

    const stockData = await fetchBatchStockData(limitedSymbols);

    return NextResponse.json({ stockData }, { status: 200 });
  } catch (error) {
    console.error('Error processing stock data request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}