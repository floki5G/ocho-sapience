import { Portfolio } from "@/types";

export const mockPortfolioData: Portfolio = {
  sectors: [
    {
      name: "Consumer Services Sector",
      stocks: [
        {
          symbol: "ZOMATO",
          name: "Zomato Ltd.",
          exchange: "NSE",
          purchasePrice: 250.45,
          quantity: 50,
          sector: "Consumer Services",
          currency: "INR"
        },
        {
          symbol: "SWIGGY",
          name: "Bundl Technologies (Swiggy)",
          exchange: "NSE",
          purchasePrice: 370.80,
          quantity: 40,
          sector: "Consumer Services",
          currency: "INR"

        }
      ]
    },
    {
      name: "Technology Sector",
      stocks: [

        {
          symbol: "TCS",
          name: "Tata Consultancy Services",
          exchange: "NSE",
          purchasePrice: 3500.75,
          quantity: 10,
          sector: "Technology",
          currency: "INR"
        },
        {
          symbol: "INFY",
          name: "Infosys Ltd.",
          exchange: "NSE",
          purchasePrice: 1450.50,
          quantity: 20,
          sector: "Technology",
          currency: "INR"
        },
        {
          symbol: "WIPRO",
          name: "Wipro Ltd.",
          exchange: "NSE",
          purchasePrice: 410.25,
          quantity: 30,
          sector: "Technology",
          currency: "INR"
        }
      ]
    },
    {
      name: "Financial Sector",
      stocks: [
        {
          symbol: "HDFCBANK",
          name: "HDFC Bank Ltd.",
          exchange: "NSE",
          purchasePrice: 1600.30,
          quantity: 15,
          sector: "Financial",
          currency: "INR"
        },
        {
          symbol: "ICICIBANK",
          name: "ICICI Bank Ltd.",
          exchange: "NSE",
          purchasePrice: 940.20,
          quantity: 25,
          sector: "Financial",
          currency: "INR"
        }
      ]
    },

  ]
};