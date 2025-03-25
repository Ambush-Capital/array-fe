/**
 * Basic tests for the Array API Client
 * 
 * Tests the getCurrent and getData endpoints
 */

// Import the API client
import ApiClient from './api';

// Create a new API client instance
const apiClient = new ApiClient();

// Test pubkey
const TEST_PUBKEY = '8y9wxTgm4G8gJ1RZr4fQ5eGXtb5vMNXVpd2nGKVTJSYL';

/**
 * Test the markets.getCurrent endpoint
 */
async function testGetCurrent() {
  console.log('Testing markets.getCurrent()...');
  try {
    const markets = await apiClient.markets.getCurrent();
    console.log('✅ markets.getCurrent() successful');
    console.log(`Received ${markets.length} markets`);
    
    // Display the first market if available
    if (markets.length > 0) {
      console.log('Sample market data:', {
        symbol: markets[0].symbol,
        price: markets[0].price,
        supply_apy: markets[0].supply_apy,
        borrow_apy: markets[0].borrow_apy
      });
    }
  } catch (error) {
    console.error('❌ markets.getCurrent() failed:', error.message);
  }
}

/**
 * Test the wallet.getData endpoint
 */
async function testGetWalletData() {
  console.log(`\nTesting wallet.getData('${TEST_PUBKEY}')...`);
  try {
    const walletData = await apiClient.wallet.getData(TEST_PUBKEY);
    console.log('✅ wallet.getData() successful');
    console.log(`Received ${walletData.wallet_balances.length} balances and ${walletData.wallet_positions.length} positions`);
    
    // Display the first balance if available
    if (walletData.wallet_balances.length > 0) {
      console.log('Sample balance:', {
        symbol: walletData.wallet_balances[0].symbol,
        amount: walletData.wallet_balances[0].amount
      });
    }
  } catch (error) {
    console.error(`❌ wallet.getData('${TEST_PUBKEY}') failed:`, error.message);
  }
}

// Run the tests
(async () => {
  console.log('Starting API client tests...');
  
  // Run the tests
  await testGetCurrent();
  await testGetWalletData();
  
  console.log('Tests completed');
})();