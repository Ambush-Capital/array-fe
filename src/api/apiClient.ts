/**
 * Array API Client
 * 
 * A TypeScript module that interfaces with the backend API running at http://localhost:3001
 * For use in a React application with Privy wallet integration.
 */

/**
 * Interface for wallet data response
 */
interface WalletData {
  wallet_balances: Array<{
    symbol: string;
    amount: [number, number]; // [amount, decimals]
  }>;
  wallet_positions: Array<{
    id: string;
    borrowed_amount: string;
    collateral_amount: string;
  }>;
}

/**
 * Interface for market data
 */
interface MarketData {
  symbol: string;
  price: number;
  supply_apy: number;
  borrow_apy: number;
}

/**
 * Interface for user profile data
 */
interface UserProfile {
  wallet_address: string;
  email?: string;
  risk_level: string;
  created_date: string;
  last_logged_in?: string;
}

/**
 * Interface for creating a new user
 */
interface CreateUserRequest {
  wallet_address: string;
  email?: string;
  risk_level: string;
}

/**
 * Interface for updating a user profile
 */
interface UpdateUserRequest {
  email?: string;
  risk_level?: string;
  update_login_time?: boolean;
}

/**
 * Generic API response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * API client for the Array backend
 */
class ApiClient {
  private baseUrl: string;

  /**
   * Creates a new API client
   * @param baseUrl - The base URL for the API
   */
  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic request method for all API calls
   * @param endpoint - API endpoint
   * @param options - Fetch options
   * @returns Promise with the response data
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `HTTP error ${response.status}`
        }));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Markets API endpoints
   */
  markets = {
    /**
     * Gets current market data
     * @returns Promise containing current market data
     */
    getCurrent: () => this.request<MarketData[]>('/current_markets', {
      method: 'GET'
    }),

    /**
     * Gets historical market data
     * @returns Promise containing historical market data
     */
    getHistorical: () => this.request<any[]>('/historical_markets', {
      method: 'GET'
    })
  };

  /**
   * Wallet API endpoints
   */
  wallet = {
    /**
     * Gets wallet data for a specific public key
     * @param pubkey - The public key of the wallet
     * @returns Promise containing wallet data
     */
    getData: (pubkey: string) => {
      if (!pubkey) throw new Error('Public key is required');
      return this.request<WalletData>(`/wallet/${pubkey}`, {
        method: 'GET'
      });
    },

    /**
     * Gets user obligations for a specific public key
     * @param pubkey - The public key of the wallet
     * @returns Promise containing user obligations
     */
    getObligations: (pubkey: string) => {
      if (!pubkey) throw new Error('Public key is required');
      return this.request<any[]>(`/user_obligations/${pubkey}`, {
        method: 'GET'
      });
    }
  };

  /**
   * User API endpoints
   */
  user = {
    /**
     * Creates a new user
     * @param userData - The user data to create
     * @returns Promise containing the created user profile
     */
    postUser: (userData: CreateUserRequest) => {
      if (!userData.wallet_address) throw new Error('Wallet address is required');
      return this.request<ApiResponse<UserProfile>>('/user', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },

    /**
     * Gets a user profile by wallet address
     * @param pubkey - The wallet address of the user
     * @returns Promise containing the user profile
     */
    getProfile: (pubkey: string) => {
      if (!pubkey) throw new Error('Wallet address is required');
      return this.request<ApiResponse<UserProfile>>(`/user/${pubkey}`, {
        method: 'GET'
      });
    },

    /**
     * Updates a user profile
     * @param pubkey - The wallet address of the user
     * @param userData - The user data to update
     * @returns Promise containing the updated user profile
     */
    updateProfile: (pubkey: string, userData: UpdateUserRequest) => {
      if (!pubkey) throw new Error('Wallet address is required');
      return this.request<ApiResponse<UserProfile>>(`/user/${pubkey}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
    }
  };
}

export default ApiClient;
