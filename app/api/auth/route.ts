import { NextResponse } from 'next/server';
import { hashPassword, comparePasswords, generateToken, findUserByEmail, createUser } from '@/app/lib/utils';
import { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { path, ...body } = await request.json();
    
    if (path === '/signup') {
      const { email, password, name } = body;
      
      // Check if user already exists
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }
      
      // Create new user
      const hashedPassword = await hashPassword(password);
      const user = await createUser({
        email,
        password: hashedPassword,
        name,
        subscriptionPlan: 'free',
      });
      
      // Generate token
      const { password: _, ...userWithoutPassword } = user;
      const token = generateToken(userWithoutPassword);
      
      return NextResponse.json({ user: userWithoutPassword, token });
    }
    
    if (path === '/login') {
      const { email, password } = body;
      
      // Find user
      const user = await findUserByEmail(email);
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      
      // Verify password
      const isValid = await comparePasswords(password, user.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      
      // Generate token
      const { password: _, ...userWithoutPassword } = user;
      const token = generateToken(userWithoutPassword);
      
      return NextResponse.json({ user: userWithoutPassword, token });
    }
    
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
