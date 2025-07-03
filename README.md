# Crypto Portfolio Tracker - Frontend

A modern React frontend application built with Vite and TypeScript for tracking cryptocurrency portfolios.

## Live Demo

🌐 **Production URL**: https://65.109.209.105

## Features

- **User Authentication** - Secure login and registration system
- **Portfolio Dashboard** - Real-time portfolio overview and management
- **Live Prices** - Real-time cryptocurrency prices from Bitazza API
- **Responsive Design** - Mobile-friendly interface that works on all devices
- **Modern UI** - Clean and professional design built with Tailwind CSS
- **Fast Development** - Quick development experience powered by Vite

## Technology Stack

- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **React Router** for navigation between pages
- **Axios** for making API requests
- **Tailwind CSS** for styling and design
- **Context API** for managing application state

## Getting Started

### Requirements

- Node.js 16 or higher and npm
- Backend API running on port 3001

### Installation Steps

1. Clone the repository to your local machine
2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and go to http://localhost:3000

### Environment Configuration

#### Development Environment

Create `.env.development` file with the following content:

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Crypto Portfolio Tracker
```

#### Production Environment

For production deployment, set these environment variables on your server:

```env
# API Configuration
VITE_API_URL=https://65.109.209.105/api
VITE_APP_NAME=Crypto Portfolio Tracker

# Build Configuration
NODE_ENV=production
```

#### Server Environment Variables Setup

When deploying to your server, you need to configure the following:

1. **Frontend Environment Variables** (in your deployment environment):

   ```bash
   export VITE_API_URL=https://65.109.209.105/api
   export VITE_APP_NAME="Crypto Portfolio Tracker"
   export NODE_ENV=production
   ```

2. **Backend Environment Variables** (for your backend server):

   ```bash
   export PORT=3001
   export DATABASE_URL=your_database_connection_string
   export JWT_SECRET=your_jwt_secret_key
   export BITAZZA_API_KEY=your_bitazza_api_key
   export CORS_ORIGIN=https://65.109.209.105
   ```

3. **Nginx Configuration** (already configured in `nginx.conf`):

   - Proxies `/api/*` requests to backend
   - Serves frontend for all other routes
   - Backend server should be accessible at `host.docker.internal:3001`

4. **Docker Environment** (if using Docker):

   ```bash
   # Frontend container
   docker run -d \
     -e VITE_API_URL=https://65.109.209.105/api \
     -e VITE_APP_NAME="Crypto Portfolio Tracker" \
     -p 80:80 \
     your-frontend-image

   # Backend container
   docker run -d \
     -e PORT=3001 \
     -e DATABASE_URL=your_database_url \
     -e JWT_SECRET=your_jwt_secret \
     -e BITAZZA_API_KEY=your_api_key \
     -e CORS_ORIGIN=https://65.109.209.105 \
     -p 3001:3001 \
     your-backend-image
   ```

## Available Commands

- `npm run dev` - Start the development server
- `npm run build` - Create a production build
- `npm run preview` - Preview the production build locally
- `npm run lint` - Check code quality with ESLint
- `npm run type-check` - Verify TypeScript types

## Project Organization

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication-related components
│   ├── portfolio/       # Portfolio management components
│   └── ui/              # General UI components
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── pages/               # Main page components
├── services/            # API service functions
├── types/               # TypeScript type definitions
└── App.tsx              # Main application component
```

## Main Features

### User Authentication

- Secure JWT-based authentication system
- Persistent login state across browser sessions
- Protected routes for authenticated users only

### Portfolio Management

- Add, edit, and delete cryptocurrency holdings
- Real-time portfolio value calculation
- Performance tracking and analysis

### Price Integration

- Live cryptocurrency price updates
- Rate-limited API calls to prevent overload
- Cached responses for better performance

## Backend Integration

The frontend connects to a NestJS backend API with these main endpoints:

- Authentication endpoints (`/auth/login`, `/auth/register`)
- Portfolio management (`/portfolio`)
- Real-time price data (`/price/current`)

## How It Works

### Dashboard Architecture

The Dashboard is the main component that orchestrates the entire portfolio management system. Here's how it's structured:

```
Dashboard Component
├── State Management
│   ├── showAddForm (boolean)
│   ├── availableSymbols (string[])
│   ├── editingPortfolio (Portfolio | null)
│   └── successMessage (string | null)
├── Custom Hooks
│   ├── usePortfolio() - Portfolio CRUD operations
│   └── usePrices() - Real-time price updates
└── Child Components
    ├── PortfolioSummary - Overview cards
    ├── PortfolioTable - Data table with pagination
    ├── AddPortfolioForm - Add/Edit form
    ├── LoadingSpinner - Loading states
    └── Alert - Success/Error messages
```

### Data Flow

When users interact with the application, data flows through this path:

```
User Action → Dashboard → Custom Hooks → API Service → Backend
     ↓              ↓           ↓           ↓         ↓
  Click Add    handleAdd   createPortfolio  POST    Database
  Button       Portfolio   (usePortfolio)   /portfolio  Update
     ↓              ↓           ↓           ↓         ↓
  Form Data   State Update  Local State   Response   Success
     ↓              ↓           ↓           ↓         ↓
  UI Update   Re-render    Component     Data       Confirmation
```

### Real-time Price Updates

The application automatically updates cryptocurrency prices every 6 seconds:

```
usePrices Hook
├── Initial Load
│   └── fetchPrices() → API → Set prices state
├── Auto-refresh (every 6 seconds)
│   ├── setInterval(fetchPrices, 6000)
│   └── Update lastUpdated timestamp
└── Manual refresh
    └── refetch() function

PortfolioSummary & PortfolioTable
├── Receive prices prop
├── Calculate real-time values
└── Display updated P&L
```

### Portfolio Management Operations

The application supports three main operations for managing cryptocurrency holdings:

#### Create New Holding

```
1. User clicks "Add Holding" button
2. AddPortfolioForm component appears
3. User selects cryptocurrency and enters details
4. Form validation checks all required fields
5. handleAddPortfolio() processes the submission
6. createPortfolio() sends POST request to API
7. New holding appears in portfolio table
8. Success message confirms the action
```

#### Edit Existing Holding

```
1. User clicks "Edit" button in portfolio table
2. Dashboard sets editingPortfolio state
3. AddPortfolioForm appears with pre-filled data
4. User modifies the holding details
5. handleAddPortfolio() processes the update
6. updatePortfolio() sends PATCH request to API
7. Portfolio table updates with new data
8. Success message confirms the update
```

#### Delete Holding

```
1. User clicks "Delete" button in portfolio table
2. Confirmation dialog appears
3. If confirmed, deletePortfolio() is called
4. DELETE request sent to API
5. Holding removed from local state
6. Portfolio table updates immediately
7. Success message confirms deletion
```

### Component Communication

Components communicate through props and callback functions:

```
Dashboard (Parent)
├── Props to PortfolioSummary
│   ├── portfolios[] - User's holdings
│   └── prices{} - Current crypto prices
├── Props to PortfolioTable
│   ├── portfolios[] - User's holdings
│   ├── prices{} - Current crypto prices
│   ├── onEdit() - Edit handler
│   ├── onDelete() - Delete handler
│   └── pagination{} - Page info
└── Props to AddPortfolioForm
    ├── onSubmit() - Form submission
    ├── onCancel() - Cancel handler
    ├── availableSymbols[] - Crypto options
    └── editingPortfolio - Edit mode data
```

### State Management

The application uses React hooks for state management:

```
Dashboard State
├── Local State (useState)
│   ├── showAddForm - Controls form visibility
│   ├── availableSymbols - Crypto symbols from API
│   ├── editingPortfolio - Current editing item
│   └── successMessage - User feedback
├── Portfolio State (usePortfolio)
│   ├── portfolios[] - User holdings
│   ├── loading - Loading state
│   ├── error - Error messages
│   └── pagination - Page controls
└── Price State (usePrices)
    ├── prices{} - Current crypto prices
    ├── loading - Price loading state
    ├── error - Price errors
    └── lastUpdated - Last update timestamp
```

### Error Handling

The application handles various error scenarios gracefully:

```
Error Scenarios
├── Portfolio Loading Error
│   ├── usePortfolio sets error state
│   ├── Dashboard displays Alert component
│   └── User sees error message
├── Price Update Error
│   ├── usePrices sets error state
│   ├── Dashboard displays warning Alert
│   └── App continues with cached prices
├── Form Submission Error
│   ├── handleAddPortfolio catches error
│   ├── Error thrown to AddPortfolioForm
│   └── Form displays validation errors
└── Network Error
    ├── API service catches axios errors
    ├── Error propagated to hooks
    └── UI shows appropriate error message
```

### Performance Optimizations

The application includes several performance features:

```
Performance Features
├── Real-time Updates
│   ├── 6-second price refresh interval
│   ├── Optimistic UI updates
│   └── Background price fetching
├── Pagination
│   ├── Load only 10 items per page
│   ├── Reduce initial load time
│   └── Better memory usage
├── Caching
│   ├── Price data cached in state
│   ├── Portfolio data cached locally
│   └── Reduce API calls
└── Loading States
    ├── Skeleton loading for tables
    ├── Spinner for operations
    └── Smooth transitions
```

## How to Contribute

1. Fork the repository to your account
2. Create a new branch for your feature
3. Make your changes and improvements
4. Test your changes thoroughly
5. Submit a pull request with your changes

## License

This project uses the MIT License.
