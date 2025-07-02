import React from "react";
import { Portfolio, PriceData } from "../../types";

interface PortfolioSummaryProps {
  portfolios: Portfolio[];
  prices: PriceData;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  portfolios,
  prices,
}) => {
  console.log("prices", prices);
  console.log("portfolios", portfolios);
  const calculateTotalValue = () => {
    return portfolios.reduce((total, item) => {
      const amount =
        typeof item.amount === "string" ? parseFloat(item.amount) : item.amount;
      const purchasePrice =
        typeof item.purchasePrice === "string"
          ? parseFloat(item.purchasePrice)
          : item.purchasePrice;
      const currentPrice =
        prices[item.cryptocurrencyType]?.price || purchasePrice;
      return total + amount * currentPrice;
    }, 0);
  };

  const calculateTotalInvestment = () => {
    return portfolios.reduce((total, item) => {
      const amount =
        typeof item.amount === "string" ? parseFloat(item.amount) : item.amount;
      const purchasePrice =
        typeof item.purchasePrice === "string"
          ? parseFloat(item.purchasePrice)
          : item.purchasePrice;
      return total + amount * purchasePrice;
    }, 0);
  };

  const totalValue = calculateTotalValue();
  const totalInvestment = calculateTotalInvestment();
  const totalChange = totalValue - totalInvestment;
  const changePercentage =
    totalInvestment > 0 ? (totalChange / totalInvestment) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  return (
    <div className="card-elevated p-6 mb-8 slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Portfolio Overview
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wider">
              Total Value
            </h3>
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-blue-900 mb-1">
            {formatCurrency(totalValue)}
          </p>
          <p className="text-sm text-blue-600">
            {portfolios.length}{" "}
            {portfolios.length === 1 ? "holding" : "holdings"}
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Total Investment
            </h3>
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {formatCurrency(totalInvestment)}
          </p>
          <p className="text-sm text-gray-600">Average cost basis</p>
        </div>

        <div
          className={`rounded-xl p-6 border ${
            totalChange >= 0
              ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
              : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
          }`}>
          <div className="flex items-center justify-between mb-2">
            <h3
              className={`text-sm font-semibold uppercase tracking-wider ${
                totalChange >= 0 ? "text-green-700" : "text-red-700"
              }`}>
              Total P&L
            </h3>
            <svg
              className={`w-5 h-5 ${
                totalChange >= 0 ? "text-green-600" : "text-red-600"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              {totalChange >= 0 ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              )}
            </svg>
          </div>
          <p
            className={`text-3xl font-bold mb-1 ${
              totalChange >= 0 ? "text-green-900" : "text-red-900"
            }`}>
            {formatCurrency(totalChange)}
          </p>
          <p
            className={`text-sm ${
              totalChange >= 0 ? "text-green-600" : "text-red-600"
            }`}>
            {formatPercentage(changePercentage)}
          </p>
        </div>
      </div>

      {totalInvestment > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Performance
            </span>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  changePercentage >= 0 ? "bg-green-500" : "bg-red-500"
                }`}></div>
              <span
                className={`text-sm font-medium ${
                  changePercentage >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                {changePercentage >= 0 ? "Profitable" : "Loss"} Portfolio
              </span>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                changePercentage >= 0 ? "bg-green-500" : "bg-red-500"
              }`}
              style={{
                width: `${Math.min(Math.abs(changePercentage) * 2, 100)}%`,
              }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioSummary;
