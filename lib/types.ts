export interface User {
  id: string;
  email: string;
  password: string; // Will be hashed
  name: string;
  subscriptionPlan: 'free' | 'paid' | 'paid+';
  customProfiles?: string[]; // LinkedIn profile URLs
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBase {
  posts: LinkedInPost[];
  lastUpdated: string;
}

export interface LinkedInPost {
  id: string;
  authorProfile: string;
  content: string;
  url: string;
  engagementMetrics: {
    reactions: number;
    comments: number;
    shares: number;
  };
  topics: string[];
  createdAt: string;
}


export interface LinkedInPost {
  text: string;
  parsed_datetime: string;
  author?: {
    name: string;
    headline: string;
    profile_url: string;
  };
  engagement?: {
    reactions: number;
    comments: number;
    shares: number;
  };
  post_url: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  subscriptionPlan: 'free' | 'paid' | 'paid+';
  customProfiles?: string[];
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TopVoiceResponse {
  posts: LinkedInPost[];
  message: string;
  upgrade_options: {
    basic: string;
    pro: string;
  };
}

export interface KeywordSearchResponse {
  posts: LinkedInPost[];
  searchTerm: string;
  timestamp: string;
}
