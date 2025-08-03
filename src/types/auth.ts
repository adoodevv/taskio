export interface User {
   id: string;
   name: string;
   email: string;
   role: 'seeker' | 'taskio';
   profilePicture?: string;
   headerImage?: string;
   createdAt: Date;
}

export interface AuthState {
   user: User | null;
   token: string | null;
   isLoading: boolean;
   isAuthenticated: boolean;
}

export interface SignUpData {
   name: string;
   email: string;
   password: string;
   role: 'seeker' | 'taskio';
}

export interface SignInData {
   email: string;
   password: string;
}

export interface AuthResponse {
   message: string;
   user: User;
   token: string;
}

export interface ApiError {
   error: string;
} 