import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PortfolioSummary from "../components/portfolio/PortfolioSummary";
import PortfolioTable from "../components/portfolio/PortfolioTable";
import AddPortfolioForm from "../components/portfolio/AddPortfolioForm";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Alert from "../components/ui/Alert";
import { usePortfolio } from "../hooks/usePortfolio";
import { usePrices } from "../hooks/usePrices";
import { Portfolio } from "../types";
import { apiService } from "../services/api";

const Dashboard: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([]);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    portfolios,
    loading: portfolioLoading,
    error: portfolioError,
    pagination,
    fetchPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  } = usePortfolio();

  const {
    prices,
    loading: pricesLoading,
    error: pricesError,
    lastUpdated,
  } = usePrices();

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const symbols = await apiService.getAvailableSymbols();
        console.log("symbols", symbols);
        setAvailableSymbols(symbols);
      } catch (error) {
        console.error("Failed to fetch available symbols:", error);
      }
    };

    fetchSymbols();
  }, []);

  const handleAddPortfolio = async (data: any) => {
    try {
      if (editingPortfolio) {
        await updatePortfolio(editingPortfolio.id, data);
        setSuccessMessage("Holding updated successfully!");
      } else {
        await createPortfolio(data);
        setSuccessMessage("Holding added successfully!");
      }
      setShowAddForm(false);
      setEditingPortfolio(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      throw error;
    }
  };

  const handleEditPortfolio = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setShowAddForm(true);
  };

  const handleDeletePortfolio = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this holding?")) {
      try {
        await deletePortfolio(id);
        setSuccessMessage("Holding deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error: any) {
        console.error("Failed to delete portfolio:", error.message);
      }
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingPortfolio(null);
  };

  if (portfolioLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">Loading your portfolio...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Portfolio Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage your cryptocurrency investments
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {lastUpdated && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>{showAddForm ? "Cancel" : "Add Holding"}</span>
            </button>
          </div>
        </div>

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}

        {portfolioError && <Alert type="error" message={portfolioError} />}

        {pricesError && (
          <Alert
            type="warning"
            message={`Price update failed: ${pricesError}`}
          />
        )}

        <PortfolioSummary portfolios={portfolios} prices={prices} />

        {showAddForm && (
          <div className="slide-up">
            <AddPortfolioForm
              onSubmit={handleAddPortfolio}
              onCancel={handleCancelForm}
              availableSymbols={availableSymbols}
              editingPortfolio={editingPortfolio}
            />
          </div>
        )}

        <PortfolioTable
          portfolios={portfolios}
          prices={prices}
          onEdit={handleEditPortfolio}
          onDelete={handleDeletePortfolio}
          pagination={pagination}
          onPageChange={(page) => {
            fetchPortfolios(page, pagination?.limit || 10);
          }}
        />

        {pricesLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3 text-gray-600">
              <LoadingSpinner size="sm" />
              <span className="text-sm font-medium">Updating prices...</span>
            </div>
          </div>
        )}

        {!portfolioLoading && portfolios.length === 0 && !showAddForm && (
          <div className="card-elevated p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-blue-600"
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
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Start Building Your Portfolio
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add your first cryptocurrency holding to begin tracking your
              investments and see your portfolio performance.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary btn-lg">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Your First Holding
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
