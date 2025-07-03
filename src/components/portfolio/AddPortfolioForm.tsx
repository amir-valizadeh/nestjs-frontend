import React, { useState, useEffect } from "react";
import { CreatePortfolioRequest, Portfolio } from "../../types";
import { CryptocurrencyData, apiService } from "../../services/api";
import LoadingSpinner from "../ui/LoadingSpinner";
import Alert from "../ui/Alert";

interface AddPortfolioFormProps {
  onSubmit: (data: CreatePortfolioRequest) => Promise<void>;
  onCancel: () => void;
  availableSymbols?: string[];
  editingPortfolio?: Portfolio | null;
}

const FALLBACK_CRYPTOCURRENCIES = [
  { symbol: "BTC_THB", name: "Bitcoin (BTC)", icon: "₿" },
  { symbol: "ETH_THB", name: "Ethereum (ETH)", icon: "Ξ" },
  { symbol: "BNB_THB", name: "Binance Coin (BNB)", icon: "🟡" },
  { symbol: "ADA_THB", name: "Cardano (ADA)", icon: "🔵" },
  { symbol: "SOL_THB", name: "Solana (SOL)", icon: "🟣" },
  { symbol: "DOT_THB", name: "Polkadot (DOT)", icon: "🟢" },
  { symbol: "DOGE_THB", name: "Dogecoin (DOGE)", icon: "🐕" },
  { symbol: "AVAX_THB", name: "Avalanche (AVAX)", icon: "❄️" },
  { symbol: "MATIC_THB", name: "Polygon (MATIC)", icon: "🟣" },
  { symbol: "LINK_THB", name: "Chainlink (LINK)", icon: "🔗" },
];

const AddPortfolioForm: React.FC<AddPortfolioFormProps> = ({
  onSubmit,
  onCancel,
  editingPortfolio,
}) => {
  const [formData, setFormData] = useState({
    cryptocurrencyType: "",
    amount: "",
    purchaseDate: "",
    purchasePrice: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cryptocurrencies, setCryptocurrencies] = useState<
    CryptocurrencyData[]
  >([]);
  const [loadingCryptocurrencies, setLoadingCryptocurrencies] = useState(true);
  const [selectedCrypto, setSelectedCrypto] =
    useState<CryptocurrencyData | null>(null);

  useEffect(() => {
    const fetchCryptocurrencies = async () => {
      try {
        setLoadingCryptocurrencies(true);
        const data = await apiService.getAllCryptocurrencies();
        console.log("Fetched cryptocurrencies:", data);
        setCryptocurrencies(data);
      } catch (error) {
        console.error("Failed to fetch cryptocurrencies:", error);
        setCryptocurrencies(
          FALLBACK_CRYPTOCURRENCIES.map((crypto) => ({
            id: Math.random(),
            symbol: crypto.symbol,
            name: crypto.name,
            price: 0,
            change: 0,
            changePercent: 0,
            high: 0,
            low: 0,
            volume: 0,
            lastUpdated: new Date().toISOString(),
          }))
        );
      } finally {
        setLoadingCryptocurrencies(false);
      }
    };

    fetchCryptocurrencies();
  }, []);

  useEffect(() => {
    if (editingPortfolio) {
      setFormData({
        cryptocurrencyType: editingPortfolio.cryptocurrencyType,
        amount: editingPortfolio.amount.toString(),
        purchaseDate: editingPortfolio.purchaseDate,
        purchasePrice: editingPortfolio.purchasePrice.toString(),
      });

      const foundCrypto = cryptocurrencies.find(
        (c) => c.symbol === editingPortfolio.cryptocurrencyType
      );
      if (foundCrypto) {
        setSelectedCrypto(foundCrypto);
      }
    } else {
      setFormData({
        cryptocurrencyType: "",
        amount: "",
        purchaseDate: "",
        purchasePrice: "",
      });
      setSelectedCrypto(null);
      setSearchTerm("");
      setShowCustomInput(false);
    }
  }, [editingPortfolio, cryptocurrencies]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.cryptocurrencyType.trim()) {
      setError("Please select a cryptocurrency");
      setLoading(false);
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount");
      setLoading(false);
      return;
    }

    if (!formData.purchaseDate) {
      setError("Please select a purchase date");
      setLoading(false);
      return;
    }

    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      setError("Please enter a valid purchase price");
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        cryptocurrencyType: formData.cryptocurrencyType,
        amount: parseFloat(formData.amount),
        purchaseDate: formData.purchaseDate,
        purchasePrice: parseFloat(formData.purchasePrice),
      });
    } catch (err: any) {
      setError(err.message || "Failed to add holding");
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoSelect = (crypto: CryptocurrencyData) => {
    setFormData({
      ...formData,
      cryptocurrencyType: crypto.symbol,
    });
    setSelectedCrypto(crypto);
    setSearchTerm("");
  };

  const isEditing = !!editingPortfolio;

  const filteredCryptocurrencies = cryptocurrencies.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCryptocurrencyIcon = (symbol: string) => {
    const symbolBase = symbol.replace("_THB", "").toUpperCase();
    const iconMap: { [key: string]: string } = {
      BTC: "₿",
      ETH: "Ξ",
      BNB: "🟡",
      ADA: "🔵",
      SOL: "🟣",
      DOT: "🟢",
      DOGE: "🐕",
      AVAX: "❄️",
      MATIC: "🟣",
      LINK: "🔗",
      XRP: "💎",
      LTC: "Ł",
      BCH: "₿",
      XLM: "⭐",
      VET: "🔷",
      TRX: "⚡",
      EOS: "🔵",
      ATOM: "⚛️",
      NEO: "🟢",
      DASH: "💎",
    };
    return iconMap[symbolBase] || "🪙";
  };

  return (
    <div className="card-elevated p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {isEditing ? "Edit Holding" : "Add New Holding"}
          </h3>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Update your cryptocurrency holding details"
              : "Add a new cryptocurrency to your portfolio"}
          </p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
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
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="cryptocurrencyType"
              className="block text-sm font-semibold text-gray-700 mb-2">
              Cryptocurrency
            </label>

            {!showCustomInput ? (
              <div className="space-y-3">
                {selectedCrypto ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {getCryptocurrencyIcon(selectedCrypto.symbol)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-green-900">
                            {selectedCrypto.name}
                          </div>
                          <div className="text-sm text-green-600">
                            {selectedCrypto.symbol}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCrypto(null);
                          setFormData({ ...formData, cryptocurrencyType: "" });
                        }}
                        className="text-green-600 hover:text-green-700">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search cryptocurrencies..."
                        className="input pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg mt-2">
                      {loadingCryptocurrencies ? (
                        <div className="px-4 py-8 text-center">
                          <LoadingSpinner size="sm" className="mx-auto mb-2" />
                          <p className="text-gray-500">
                            Loading cryptocurrencies...
                          </p>
                        </div>
                      ) : filteredCryptocurrencies.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {filteredCryptocurrencies.map((crypto) => (
                            <button
                              key={crypto.id}
                              type="button"
                              onClick={() => handleCryptoSelect(crypto)}
                              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                                formData.cryptocurrencyType === crypto.symbol
                                  ? "bg-blue-50 border-l-4 border-blue-500"
                                  : ""
                              }`}>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">
                                    {getCryptocurrencyIcon(crypto.symbol)}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {crypto.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {crypto.symbol}
                                  </div>
                                </div>
                                {crypto.price > 0 && (
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                      ${crypto.price.toLocaleString()}
                                    </div>
                                    <div
                                      className={`text-xs ${
                                        crypto.changePercent >= 0
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }`}>
                                      {crypto.changePercent >= 0 ? "+" : ""}
                                      {crypto.changePercent.toFixed(2)}%
                                    </div>
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <svg
                            className="w-8 h-8 mx-auto mb-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <p>No cryptocurrencies found</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(true)}
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                    Can't find your cryptocurrency? Add custom
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <input
                    id="cryptocurrencyType"
                    name="cryptocurrencyType"
                    type="text"
                    required
                    className="input pl-10"
                    placeholder="e.g., BTC_THB, ETH_THB"
                    value={formData.cryptocurrencyType}
                    onChange={handleChange}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="text-sm text-gray-600 hover:text-gray-500">
                  ← Back to selection
                </button>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-semibold text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
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
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.00000001"
                min="0.00000001"
                required
                className="input pl-10"
                placeholder="0.00000000"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="purchaseDate"
              className="block text-sm font-semibold text-gray-700 mb-2">
              Purchase Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                required
                max={new Date().toISOString().split("T")[0]}
                className="input pl-10"
                value={formData.purchaseDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="purchasePrice"
              className="block text-sm font-semibold text-gray-700 mb-2">
              Purchase Price (USD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
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
              <input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                step="0.01"
                min="0.01"
                required
                className="input pl-10"
                placeholder="0.00"
                value={formData.purchasePrice}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="btn-success flex items-center justify-center space-x-2 flex-1">
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>{isEditing ? "Updating..." : "Adding..."}</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{isEditing ? "Update Holding" : "Add Holding"}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex items-center justify-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPortfolioForm;
