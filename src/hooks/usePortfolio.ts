import { useState, useEffect } from "react";
import {
  Portfolio,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
} from "../types";
import { apiService } from "../services/api";

export const usePortfolio = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchPortfolios = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      console.log("Fetching portfolios...");
      const data = await apiService.getPortfolios(page, limit);
      console.log("Portfolios fetched:", data);
      setPortfolios(data.portfolios);
      setPagination({
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });
      setError(null);
    } catch (err: any) {
      console.error("Error fetching portfolios:", err);
      setError(err.response?.data?.message || "Failed to fetch portfolios");
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async (data: CreatePortfolioRequest) => {
    try {
      console.log("Creating portfolio:", data);
      const newPortfolio = await apiService.createPortfolio(data);
      console.log("Portfolio created:", newPortfolio);
      setPortfolios((prev) => [newPortfolio, ...prev]);
      return newPortfolio;
    } catch (err: any) {
      console.error("Error creating portfolio:", err);
      throw new Error(
        err.response?.data?.message || "Failed to create portfolio"
      );
    }
  };

  const updatePortfolio = async (id: number, data: UpdatePortfolioRequest) => {
    try {
      console.log("Updating portfolio:", id, data);
      const updatedPortfolio = await apiService.updatePortfolio(id, data);
      console.log("Portfolio updated:", updatedPortfolio);
      setPortfolios((prev) =>
        prev.map((p) => (p.id === id ? updatedPortfolio : p))
      );
      return updatedPortfolio;
    } catch (err: any) {
      console.error("Error updating portfolio:", err);
      throw new Error(
        err.response?.data?.message || "Failed to update portfolio"
      );
    }
  };

  const deletePortfolio = async (id: number) => {
    try {
      console.log("Deleting portfolio:", id);
      await apiService.deletePortfolio(id);
      console.log("Portfolio deleted successfully");
      setPortfolios((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error("Error deleting portfolio:", err);
      throw new Error(
        err.response?.data?.message || "Failed to delete portfolio"
      );
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  return {
    portfolios,
    loading,
    error,
    pagination,
    fetchPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  };
};
