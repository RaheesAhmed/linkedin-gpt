import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '@/app/lib/utils';
import { LinkedInPost } from '@/app/lib/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    const user = await findUserByEmail(decoded.email);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function GET(request: Request) {
  try {
    // Get token from headers
    const headersList = headers();
    const token = headersList.get('token');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify token and get user
    const user = await verifyToken(token);

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (path === '/top-voices') {
      // Free tier - Top Voices posts
      const posts = await fetchTopVoicesPosts();
      return NextResponse.json({ posts });
    }

    if (path === '/custom-profiles') {
      // Paid tier - Custom profile posts
      if (user.subscriptionPlan === 'free') {
        return NextResponse.json({ error: 'Subscription required' }, { status: 403 });
      }

      const profiles = searchParams.getAll('profiles');
      if (!profiles || profiles.length === 0) {
        return NextResponse.json({ error: 'No profiles provided' }, { status: 400 });
      }

      if (profiles.length > 2) {
        return NextResponse.json({ error: 'Maximum 2 profiles allowed' }, { status: 400 });
      }

      const posts = await fetchCustomProfilePosts(profiles);
      return NextResponse.json({ posts });
    }

    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  } catch (error) {
    console.error('LinkedIn API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Mock functions for LinkedIn data fetching
// In production, these would interact with LinkedIn's API
async function fetchTopVoicesPosts(): Promise<LinkedInPost[]> {
  // Mock data
  return [
    {
      id: '1',
      authorProfile: 'https://linkedin.com/in/top-voice-1',
      content: 'Sample post from Top Voice 1',
      url: 'https://linkedin.com/post/1',
      engagementMetrics: {
        reactions: 1000,
        comments: 50,
        shares: 20
      },
      topics: ['AI', 'Technology'],
      createdAt: new Date().toISOString()
    }
  ];
}

async function fetchCustomProfilePosts(profiles: string[]): Promise<LinkedInPost[]> {
  // Mock data
  return profiles.map((profile, index) => ({
    id: String(index + 1),
    authorProfile: profile,
    content: `Sample post from ${profile}`,
    url: `https://linkedin.com/post/${index + 1}`,
    engagementMetrics: {
      reactions: 500,
      comments: 25,
      shares: 10
    },
    topics: ['Business', 'Innovation'],
    createdAt: new Date().toISOString()
  }));
}
