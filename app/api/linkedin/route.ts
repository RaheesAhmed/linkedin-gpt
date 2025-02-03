import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';
import { 
  User, 
  LinkedInPost, 
  TopVoicesResponse, 
  CustomProfileResponse, 
  KeywordSearchResponse,
  ErrorResponse 
} from '@/lib/types';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

interface UsersData {
  users: Array<{
    id: string;
    email: string;
    subscriptionPlan: string;
    subscription?: {
      planId: string;
      status: 'active' | 'cancelled' | 'none';
      expiresAt?: string;
    };
  }>;
}

async function getUsers(): Promise<UsersData> {
  try {
    const content = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return { users: [] };
  }
}

async function checkSubscription(email: string): Promise<boolean> {
  try {
    const { users } = await getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return false;
    }

    // Handle both new subscription format and old subscriptionPlan format
    if (user.subscription) {
      return user.subscription.status === 'active' && 
        (!user.subscription.expiresAt || new Date(user.subscription.expiresAt) > new Date());
    }

    // Legacy support for old subscriptionPlan format
    return user.subscriptionPlan === 'PRO' || user.subscriptionPlan === 'PREMIUM';
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

// Mock data for demonstration
const mockTopVoices: LinkedInPost[] = [
  {
    id: '1',
    content: "Leadership isn't about being in charge. It's about taking care of those in your charge.",
    author: {
      name: "Simon Sinek",
      headline: "Optimist and Author",
      profileUrl: "https://linkedin.com/in/simonsinek"
    },
    stats: {
      likes: 15000,
      comments: 500,
      shares: 1000
    },
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    content: "The biggest risk is not taking any risk. In a world that's changing quickly, the only strategy that is guaranteed to fail is not taking risks.",
    author: {
      name: "Mark Zuckerberg",
      headline: "CEO at Meta",
      profileUrl: "https://linkedin.com/in/markzuckerberg"
    },
    stats: {
      likes: 20000,
      comments: 800,
      shares: 1500
    },
    timestamp: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      } as ErrorResponse, { status: 401 });
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Check subscription for premium features
    const isPremium = await checkSubscription(session.user.email);

    switch (action) {
      case 'topVoices': {
        // Free tier - Top Voices posts
        const response: TopVoicesResponse = {
          success: true,
          data: {
            posts: mockTopVoices
          }
        };
        return NextResponse.json(response);
      }

      case 'customProfile': {
        // Premium feature - Custom profile analysis
        if (!isPremium) {
          return NextResponse.json({
            error: 'Premium subscription required',
            upgrade: true
          } as ErrorResponse, { status: 403 });
        }
        
        const profileUrl = searchParams.get('profileUrl');
        if (!profileUrl) {
          return NextResponse.json({ 
            error: 'Profile URL is required' 
          } as ErrorResponse, { status: 400 });
        }

        const response: CustomProfileResponse = {
          success: true,
          data: {
            profile: {
              url: profileUrl,
              posts: mockTopVoices.map(post => ({
                ...post,
                author: {
                  ...post.author,
                  profileUrl
                }
              }))
            }
          }
        };
        return NextResponse.json(response);
      }

      case 'keywordSearch': {
        // Premium feature - Keyword search
        if (!isPremium) {
          return NextResponse.json({
            error: 'Premium subscription required',
            upgrade: true
          } as ErrorResponse, { status: 403 });
        }

        const keyword = searchParams.get('keyword');
        if (!keyword) {
          return NextResponse.json({ 
            error: 'Keyword is required' 
          } as ErrorResponse, { status: 400 });
        }

        const searchResults = mockTopVoices.filter(post => 
          post.content.toLowerCase().includes(keyword.toLowerCase())
        );

        const response: KeywordSearchResponse = {
          success: true,
          data: {
            keyword,
            results: searchResults
          }
        };
        return NextResponse.json(response);
      }

      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        } as ErrorResponse, { status: 400 });
    }
  } catch (error) {
    console.error('LinkedIn API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ErrorResponse, { status: 500 });
  }
}
