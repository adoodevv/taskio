'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useRef } from 'react';
import { AuthState, User, SignUpData, SignInData, AuthResponse, ApiError } from '@/types/auth';
import toast from 'react-hot-toast';

// Initial state
const initialState: AuthState = {
   user: null,
   token: null,
   isLoading: true,
   isAuthenticated: false,
};

// Action types
type AuthAction =
   | { type: 'SET_LOADING'; payload: boolean }
   | { type: 'SET_USER'; payload: { user: User; token: string } }
   | { type: 'LOGOUT' }
   | { type: 'SET_ERROR'; payload: string };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
   switch (action.type) {
      case 'SET_LOADING':
         return { ...state, isLoading: action.payload };
      case 'SET_USER':
         return {
            ...state,
            user: action.payload.user,
            token: action.payload.token,
            isAuthenticated: true,
            isLoading: false,
         };
      case 'LOGOUT':
         return {
            ...state,
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
         };
      default:
         return state;
   }
}

// Context
interface AuthContextType extends AuthState {
   signUp: (data: SignUpData) => Promise<void>;
   signIn: (data: SignInData) => Promise<void>;
   logout: () => void;
   verifyToken: () => Promise<void>;
   refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
   const [state, dispatch] = useReducer(authReducer, initialState);
   const isInitialized = useRef(false);

   const verifyToken = useCallback(async () => {
      try {
         const token = localStorage.getItem('token');

         if (!token) {
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
         }

         const response = await fetch('/api/auth/verify', {
            headers: {
               'Authorization': `Bearer ${token}`,
            },
         });

         if (!response.ok) {
            localStorage.removeItem('token');
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
         }

         const result = await response.json();

         dispatch({
            type: 'SET_USER',
            payload: { user: result.user, token },
         });
      } catch (error) {
         console.error('Token verification error:', error);
         localStorage.removeItem('token');
         dispatch({ type: 'SET_LOADING', payload: false });
      }
   }, []);

   const signUp = async (data: SignUpData) => {
      try {
         dispatch({ type: 'SET_LOADING', payload: true });

         const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
         });

         const result: AuthResponse | ApiError = await response.json();

         if (!response.ok) {
            throw new Error((result as ApiError).error);
         }

         const authResponse = result as AuthResponse;

         // Store token in localStorage
         localStorage.setItem('token', authResponse.token);

         dispatch({
            type: 'SET_USER',
            payload: { user: authResponse.user, token: authResponse.token },
         });

         toast.success(authResponse.message);
      } catch (error) {
         const errorMessage = error instanceof Error ? error.message : 'Signup failed';
         toast.error(errorMessage);
         dispatch({ type: 'SET_LOADING', payload: false });
      }
   };

   const signIn = async (data: SignInData) => {
      try {
         dispatch({ type: 'SET_LOADING', payload: true });

         const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
         });

         const result: AuthResponse | ApiError = await response.json();

         if (!response.ok) {
            throw new Error((result as ApiError).error);
         }

         const authResponse = result as AuthResponse;

         // Store token in localStorage
         localStorage.setItem('token', authResponse.token);

         dispatch({
            type: 'SET_USER',
            payload: { user: authResponse.user, token: authResponse.token },
         });

         toast.success(authResponse.message);
      } catch (error) {
         const errorMessage = error instanceof Error ? error.message : 'Signin failed';
         toast.error(errorMessage);
         dispatch({ type: 'SET_LOADING', payload: false });
      }
   };

   const logout = () => {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
   };

   const refreshUser = useCallback(async () => {
      try {
         const token = localStorage.getItem('token');
         if (!token) return;

         const response = await fetch('/api/auth/verify', {
            headers: {
               'Authorization': `Bearer ${token}`,
            },
         });

         if (response.ok) {
            const result = await response.json();
            dispatch({
               type: 'SET_USER',
               payload: { user: result.user, token },
            });
         }
      } catch (error) {
         console.error('Refresh user error:', error);
      }
   }, []);

   // Check for existing token on mount
   useEffect(() => {
      if (isInitialized.current) {
         return;
      }

      isInitialized.current = true;

      const token = localStorage.getItem('token');

      if (token) {
         verifyToken();
      } else {
         dispatch({ type: 'SET_LOADING', payload: false });
      }
   }, [verifyToken]);

   const value: AuthContextType = {
      ...state,
      signUp,
      signIn,
      logout,
      verifyToken,
      refreshUser,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
} 