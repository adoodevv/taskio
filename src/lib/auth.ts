import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
   throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export const hashPassword = async (password: string): Promise<string> => {
   const saltRounds = 12;
   return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
   return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: IUser): string => {
   const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
   };

   return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): any => {
   try {
      return jwt.verify(token, JWT_SECRET);
   } catch (error) {
      return null;
   }
};

export const extractTokenFromHeader = (authorization: string | undefined): string | null => {
   if (!authorization || !authorization.startsWith('Bearer ')) {
      return null;
   }
   return authorization.substring(7);
}; 