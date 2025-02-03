export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface UserCredentials {
  email: string
  password: string
}

export interface UserRegistration extends UserCredentials {
  name: string
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
