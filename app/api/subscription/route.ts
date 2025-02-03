import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

interface User {
  id: string;
  email: string;
  subscription?: {
    planId: string;
    status: 'active' | 'cancelled' | 'none';
    expiresAt?: string;
  };
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

async function getUsers(): Promise<User[]> {
  try {
    const content = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return [];
  }
}

async function saveUsers(users: User[]): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { licenseKey } = await req.json();
    if (!licenseKey) {
      return NextResponse.json({ error: 'License key is required' }, { status: 400 });
    }

    // Verify the license with Gumroad
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GUMROAD_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: 'pgqFM4RebBN6QTqYIFzwWw==',
        license_key: licenseKey,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      return NextResponse.json({ error: 'Invalid license key' }, { status: 400 });
    }

    // Update user subscription in users.json
    const users = await getUsers();
    const userIndex = users.findIndex(u => u.email === session.user.email);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    users[userIndex].subscription = {
      planId: 'pro',
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    };

    await saveUsers(users);

    return NextResponse.json({ success: true, subscription: users[userIndex].subscription });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await getUsers();
    const user = users.find(u => u.email === session.user.email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ subscription: user.subscription || { status: 'none' } });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
