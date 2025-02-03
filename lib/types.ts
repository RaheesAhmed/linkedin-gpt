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
