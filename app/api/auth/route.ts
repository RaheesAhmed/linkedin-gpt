import { NextResponse } from 'next/server';
import { hashPassword, comparePasswords, generateToken } from '@/lib/utils';
import { User } from '@/lib/types';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const content = fs.readFileSync(USERS_FILE, 'utf-8');
    const users: User[] = JSON.parse(content);
    return users.find(user => user.email === email) || null;
  } catch (error) {
    return null;
  }
}

async function createUser(userData: Partial<User>): Promise<User> {
  try {
    let users: User[] = [];
    try {
      const content = fs.readFileSync(USERS_FILE, 'utf-8');
      users = JSON.parse(content);
    } catch (error) {
      // File doesn't exist or is invalid, start with empty array
    }
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || '',
      email: userData.email || '',
      password: userData.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
}

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
        name,
        password: hashedPassword
      });
      
      const token = generateToken(user);
      return NextResponse.json({ user, token });
      
    } else if (path === '/login') {
      const { email, password } = body;
      
      // Find user
      const user = await findUserByEmail(email);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      // Verify password
      const isValid = await comparePasswords(password, user.password || '');
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
      
      const token = generateToken(user);
      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({ user: userWithoutPassword, token });
    }
    
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
