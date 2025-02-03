import fs from 'fs';
import path from 'path';
import { LinkedInPost, TopVoiceResponse, KeywordSearchResponse } from '../types';

const DATA_DIR = path.join(process.cwd(), 'app/data');
const TOP_VOICE_FILE = path.join(DATA_DIR, 'topvoice_posts.json');
const KEYWORD_POSTS_FILE = path.join(DATA_DIR, 'keyword_posts.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function fetchTopVoice(): Promise<LinkedInPost[]> {
  try {
    const response = await fetch('https://n8n.top-rated.pro/webhook/441094cf-54dc-40ec-999b-13cbb94d3a82');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Sort posts by date and limit to last 100
    const sortedPosts = data
      .sort((a: LinkedInPost, b: LinkedInPost) => {
        return new Date(b.parsed_datetime).getTime() - new Date(a.parsed_datetime).getTime();
      })
      .slice(0, 100);
    
    // Save the filtered data to a json file
    fs.writeFileSync(TOP_VOICE_FILE, JSON.stringify(sortedPosts, null, 2));
    return sortedPosts;
  } catch (error) {
    console.error('Error fetching top voice posts:', error);
    throw error;
  }
}

export async function readTopVoiceFile(): Promise<TopVoiceResponse> {
  try {
    const topvoice = JSON.parse(fs.readFileSync(TOP_VOICE_FILE, 'utf8'));
    return {
      posts: topvoice,
      message: 'Want more insights? Try our paid plans for custom profile analysis and keyword search!',
      upgrade_options: {
        basic: 'Analyze up to 2 LinkedIn profiles of your choice',
        pro: 'Get keyword-based insights and AI-powered prompt generation'
      }
    };
  } catch (error) {
    console.error('Error reading TopVoice posts:', error);
    throw new Error('Error reading TopVoice posts: ' + (error as Error).message);
  }
}

export async function fetchLinkedInPosts(linkedinUrl: string): Promise<LinkedInPost[]> {
  try {
    const response = await fetch('https://n8n.top-rated.pro/webhook/de2e127b-655c-4b40-8e00-6358a056ce27', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        linkedinUrl: linkedinUrl
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if we received webhook details with an error
    if (data[0]?.error) {
      throw new Error(data[0].error.message);
    }

    // Filter posts from last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentPosts = data.filter((post: LinkedInPost) => {
      const postDate = new Date(post.parsed_datetime);
      return postDate >= last24Hours;
    });

    return recentPosts;
  } catch (error) {
    console.error('Error fetching LinkedIn posts:', error);
    throw error;
  }
}

export async function searchPostsByKeyword(keyword: string): Promise<KeywordSearchResponse> {
  try {
    const posts: LinkedInPost[] = JSON.parse(fs.readFileSync(KEYWORD_POSTS_FILE, 'utf8'));
    
    // Create regex pattern for keyword search (case insensitive)
    const pattern = new RegExp(keyword, 'i');
    
    // Filter posts by keyword
    const matchedPosts = posts.filter(post => {
      return pattern.test(post.text) || 
             pattern.test(post.author?.name || '') || 
             pattern.test(post.author?.headline || '');
    });

    return {
      posts: matchedPosts,
      searchTerm: keyword,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error searching posts by keyword:', error);
    throw error;
  }
}

export async function storeKeywordPosts(posts: LinkedInPost[]): Promise<void> {
  try {
    fs.writeFileSync(KEYWORD_POSTS_FILE, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('Error storing keyword posts:', error);
    throw error;
  }
}
