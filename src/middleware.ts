import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export function middleware(request: NextRequest) {
   // Only apply to API routes that need basic authentication
   // Services API routes handle their own authentication and role checking
   // User API routes handle their own authentication
   if (request.nextUrl.pathname.startsWith('/api/protected')) {
      const token = extractTokenFromHeader(request.headers.get('authorization') || undefined);

      if (!token) {
         return NextResponse.json(
            { error: 'No token provided' },
            { status: 401 }
         );
      }

      const decoded = verifyToken(token);
      if (!decoded) {
         return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
         );
      }
   }

   return NextResponse.next();
}

export const config = {
   matcher: [
      // '/api/auth/verify', // Removed - verify endpoint handles its own auth
      '/api/protected/:path*', // Only protect routes that explicitly need it
      // '/api/user/:path*', // Removed - user API routes handle their own auth
      // '/api/services/:path*', // Removed - services API handles its own auth and role checking
   ],
}; 