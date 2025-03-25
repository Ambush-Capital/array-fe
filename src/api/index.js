import ApiClient from './apiClient';

export default ApiClient;

// Export specific endpoint groups for convenience
export const createApiClient = (baseUrl = 'http://localhost:3001') => {
  const client = new ApiClient(baseUrl);
  return client;
};