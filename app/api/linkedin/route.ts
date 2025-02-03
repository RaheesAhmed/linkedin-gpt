import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '@/app/lib/utils';
import { LinkedInPost } from '@/app/lib/types';
import { fetchTopVoice, readTopVoiceFile, fetchLinkedInPosts, searchPostsByKeyword } from '@/app/lib/services/linkedin';

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
      try {
        // Try to read from cache first
        const response = await readTopVoiceFile();
        return NextResponse.json(response);
      } catch (error) {
        // If cache fails, fetch new data
        const posts = await fetchTopVoice();
        return NextResponse.json({
          posts,
          message: 'Want more insights? Try our paid plans for custom profile analysis and keyword search!',
          upgrade_options: {
            basic: 'Analyze up to 2 LinkedIn profiles of your choice',
            pro: 'Get keyword-based insights and AI-powered prompt generation'
          }
        });
      }
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

      // Fetch posts for each profile
      const allPosts = await Promise.all(
        profiles.map(profile => fetchLinkedInPosts(profile))
      );
      
      // Combine and sort all posts
      const combinedPosts = allPosts
        .flat()
        .sort((a, b) => new Date(b.parsed_datetime).getTime() - new Date(a.parsed_datetime).getTime());

      return NextResponse.json({ posts: combinedPosts });
    }

    if (path === '/search') {
      // Paid+ tier - Keyword search
      if (user.subscriptionPlan !== 'paid+') {
        return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 });
      }

      const keyword = searchParams.get('keyword');
      if (!keyword) {
        return NextResponse.json({ error: 'No keyword provided' }, { status: 400 });
      }

      const searchResults = await searchPostsByKeyword(keyword);
      return NextResponse.json(searchResults);
    }

    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  } catch (error) {
    console.error('LinkedIn API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
