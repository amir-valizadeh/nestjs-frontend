import { useState, useEffect, useCallback } from "react";
import { PriceData } from "../types";
import { apiService } from "../services/api";

export const usePrices = () => {
  const [prices, setPrices] = useState<PriceData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getCurrentPrices();
      setPrices(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch prices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();

    const interval = setInterval(fetchPrices, 6000);

    return () => clearInterval(interval);
  }, [fetchPrices]);

  return {
    prices,
    loading,
    error,
    lastUpdated,
    refetch: fetchPrices,
  };
};
