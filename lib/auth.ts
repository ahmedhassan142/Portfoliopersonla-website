import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function verifyAdmin(request: NextRequest): Promise<{ success: boolean; user?: AuthUser }> {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return { success: false };
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    
    if (decoded.role !== 'admin') {
      return { success: false };
    }
    
    return { success: true, user: decoded };
  } catch (error) {
    return { success: false };
  }
}