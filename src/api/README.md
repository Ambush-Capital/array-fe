# Array API Client

A TypeScript module that interfaces with the Array backend API running at http://localhost:3001.

## Features

- Structured endpoint groups for markets, wallet, and user data
- Proper error handling for all API calls
- Async/await pattern for all API requests
- TypeScript interfaces for request and response data
- JSDoc comments for all functions

## Installation

No additional installation is required as this client uses the native `fetch` API.

## Usage

### Importing the Client

```javascript
// Import the default client
import ApiClient from './api';

// Or create a client with a custom base URL
import { createApiClient } from './api';
const apiClient = createApiClient('https://custom-api-url.com');
```

### Markets Endpoints

```javascript
// Get current market data
try {
  const markets = await apiClient.markets.getCurrent();
  console.log('Current markets:', markets);
} catch (error) {
  console.error('Error fetching markets:', error);
}

// Get historical market data
try {
  const historicalData = await apiClient.markets.getHistorical();
  console.log('Historical market data:', historicalData);
} catch (error) {
  console.error('Error fetching historical data:', error);
}
```

### Wallet Endpoints

```javascript
// Get wallet data for a specific public key
try {
  const walletData = await apiClient.wallet.getData('your-wallet-pubkey');
  console.log('Wallet data:', walletData);
} catch (error) {
  console.error('Error fetching wallet data:', error);
}

// Get user obligations
try {
  const obligations = await apiClient.wallet.getObligations('your-wallet-pubkey');
  console.log('User obligations:', obligations);
} catch (error) {
  console.error('Error fetching obligations:', error);
}
```

### User Endpoints

```javascript
// Create a new user
try {
  const newUser = await apiClient.user.postUser({
    wallet_address: 'your-wallet-address',
    email: 'user@example.com',
    risk_level: 'medium'
  });
  console.log('New user created:', newUser);
} catch (error) {
  console.error('Error creating user:', error);
}

// Get user profile
try {
  const userProfile = await apiClient.user.getProfile('your-wallet-address');
  console.log('User profile:', userProfile);
} catch (error) {
  console.error('Error fetching user profile:', error);
}

// Update user profile
try {
  const updatedProfile = await apiClient.user.updateProfile('your-wallet-address', {
    email: 'updated@example.com',
    risk_level: 'high',
    update_login_time: true
  });
  console.log('Updated profile:', updatedProfile);
} catch (error) {
  console.error('Error updating profile:', error);
}
```

## Integration with Privy Wallet

When using with Privy wallet, you can get the user's wallet address like this:

```javascript
import { usePrivy } from '@privy-io/react-auth';
import ApiClient from './api';

function YourComponent() {
  const { user, authenticated } = usePrivy();
  const apiClient = new ApiClient();
  
  const fetchUserData = async () => {
    if (authenticated && user?.wallet?.address) {
      try {
        const walletData = await apiClient.wallet.getData(user.wallet.address);
        // Process wallet data
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    }
  };
  
  // Rest of your component
}
```

## Error Handling

All API methods include proper error handling and will throw descriptive errors that can be caught in try/catch blocks.
