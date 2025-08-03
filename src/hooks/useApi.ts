import { useAuth } from '@/context/AuthContext';

interface ApiOptions {
   method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
   body?: any;
   headers?: Record<string, string>;
}

export function useApi() {
   const { token, logout } = useAuth();

   const apiCall = async (url: string, options: ApiOptions = {}) => {
      const { method = 'GET', body, headers = {} } = options;

      const config: RequestInit = {
         method,
         headers: {
            'Content-Type': 'application/json',
            ...headers,
         },
      };

      // Add authorization header if token exists
      if (token) {
         config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`,
         };
      }

      // Add body if provided
      if (body && method !== 'GET') {
         config.body = JSON.stringify(body);
      }

      try {
         const response = await fetch(url, config);
         const data = await response.json();

         // Handle 401 Unauthorized - logout user
         if (response.status === 401) {
            logout();
            throw new Error('Session expired. Please login again.');
         }

         // Handle 403 Forbidden - don't logout, just throw error with API message
         if (response.status === 403) {
            throw new Error(data.error || 'Access denied. You do not have permission to perform this action.');
         }

         if (!response.ok) {
            throw new Error(data.error || 'API request failed');
         }

         return data;
      } catch (error) {
         if (error instanceof Error) {
            throw error;
         }
         throw new Error('Network error');
      }
   };

   return {
      get: (url: string, headers?: Record<string, string>) =>
         apiCall(url, { method: 'GET', headers }),

      post: (url: string, body: any, headers?: Record<string, string>) =>
         apiCall(url, { method: 'POST', body, headers }),

      put: (url: string, body: any, headers?: Record<string, string>) =>
         apiCall(url, { method: 'PUT', body, headers }),

      delete: (url: string, headers?: Record<string, string>) =>
         apiCall(url, { method: 'DELETE', headers }),

      patch: (url: string, body: any, headers?: Record<string, string>) =>
         apiCall(url, { method: 'PATCH', body, headers }),
   };
} 