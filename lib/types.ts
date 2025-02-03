export interface User {
  id: string
  name: string
  email: string
  subscription?: Subscription
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  planId: string
  status: 'active' | 'cancelled' | 'none'
  expiresAt?: string
}

export interface UserCredentials {
  email: string
  password: string
}

export interface UserRegistration extends UserCredentials {
  name: string
}

export interface LinkedInPost {
  id: string
  content: string
  author: {
    name: string
    headline?: string
    profileUrl: string
  }
  stats: {
    likes: number
    comments: number
    shares: number
  }
  timestamp: string
  url?: string
}

export interface TopVoicesResponse {
  success: boolean
  data: {
    posts: LinkedInPost[]
  }
}

export interface CustomProfileResponse {
  success: boolean
  data: {
    profile: {
      url: string
      posts: LinkedInPost[]
    }
  }
}

export interface KeywordSearchResponse {
  success: boolean
  data: {
    keyword: string
    results: LinkedInPost[]
  }
}

export interface ErrorResponse {
  error: string
  message?: string
  upgrade?: boolean
}
