import axios, { AxiosInstance, AxiosError } from "axios";
import {
  User,
  Portfolio,
  PriceData,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
  PaginatedPortfolioResponse,
  ApiError,
} from "../types";

export interface CryptocurrencyData {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  marketCap?: number;
  lastUpdated: string;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          if (localStorage.getItem("access_token")) {
            location.href = "/login";
          }
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string | null) {
    if (token) {
      localStorage.setItem("access_token", token);
      this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("access_token");
      delete this.api.defaults.headers.common["Authorization"];
    }
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>("/auth/login", data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<User> {
    const response = await this.api.post<User>("/auth/register", data);
    return response.data;
  }

  async getPortfolios(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedPortfolioResponse> {
    const response = await this.api.get<PaginatedPortfolioResponse>(
      `/portfolio?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async createPortfolio(data: CreatePortfolioRequest): Promise<Portfolio> {
    const response = await this.api.post<Portfolio>("/portfolio", data);
    return response.data;
  }

  async updatePortfolio(
    id: number,
    data: UpdatePortfolioRequest
  ): Promise<Portfolio> {
    const response = await this.api.patch<Portfolio>(`/portfolio/${id}`, data);
    return response.data;
  }

  async deletePortfolio(id: number): Promise<void> {
    await this.api.delete(`/portfolio/${id}`);
  }

  async getPortfolioPerformance(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await this.api.get(
      `/portfolio/performance?${params.toString()}`
    );
    return response.data;
  }

  async getCurrentPrices(): Promise<PriceData> {
    const response = await this.api.get<PriceData>("/price/current");
    return response.data;
  }

  async getAvailableSymbols(): Promise<string[]> {
    const response = await this.api.get<string[]>("/price/symbols");
    return response.data;
  }

  async getAllCryptocurrencies(): Promise<CryptocurrencyData[]> {
    const response = await this.api.get<CryptocurrencyData[]>(
      "/price/cryptocurrencies"
    );
    return response.data;
  }

  async getSpecificPrice(
    symbol: string
  ): Promise<{ symbol: string; price: number }> {
    const response = await this.api.get(`/price/${symbol}`);
    return response.data;
  }

  async clearPriceCache(): Promise<void> {
    await this.api.post("/price/clear-cache");
  }

  async seedCryptocurrencies(): Promise<void> {
    await this.api.post("/price/seed");
  }
}

export const apiService = new ApiService();
