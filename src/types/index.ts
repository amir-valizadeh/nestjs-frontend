export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Portfolio {
  id: number;
  cryptocurrencyType: string;
  amount: number;
  purchaseDate: string;
  purchasePrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface PriceData {
  [symbol: string]: {
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    volume: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface CreatePortfolioRequest {
  cryptocurrencyType: string;
  amount: number;
  purchaseDate: string;
  purchasePrice: number;
}

export interface UpdatePortfolioRequest
  extends Partial<CreatePortfolioRequest> {}

export interface PaginatedPortfolioResponse {
  portfolios: Portfolio[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
