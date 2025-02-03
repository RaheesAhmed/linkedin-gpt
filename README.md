# LinkedIn GPT Actions API

An intelligent API that combines LinkedIn data with GPT capabilities to provide personalized insights and content generation across different subscription tiers. This project supports custom GPT actions enabling you to dynamically update its Knowledge Base and serve tailored content based on user subscriptions.

## Features

### Subscription Plans

- **FREE Plan**

  - Daily updating Knowledge Base of LinkedIn Top Voices 2025
  - GPT interaction with Top Voices content
  - Up to 100 most recent posts

- **PAID Plan** (Subscription via Gumroad)
  - Everything in the Free Plan plus:
    - Custom Knowledge Base for LinkedIn profiles
    - Post generation capabilities
    - Keyword-based search across LinkedIn posts
    - AI prompt generation and advanced content analysis
    - 24-hour data retention for custom profile data

## Project Modules

- **Authentication and Authorization**

  - Handles user registration, login, and JWT-based authentication using bcrypt for password hashing.
  - Validates JWT tokens and ensures access-restricted endpoints are accessed only by authenticated users.

- **Data Fetching and Knowledge Base**

  - Fetches and caches TopVoice posts from an external webhook, sorts them, and stores them locally in `topvoice_posts.json`.
  - Interfaces with a webhook to pull LinkedIn posts (filtering posts from the last 24 hours) and supports keyword-based search through cached posts.

- **Payment and Subscription Management**

  - Integrates with the Gumroad API to handle subscription verification, purchase verification, and generating checkout URLs.
  - Processes incoming Gumroad webhook events (for subscription activation and cancellation) and updates the corresponding user plan.
  - Defines the available subscription plans (FREE and PAID) and methods to create subscription products and check user subscription status.

  - Provides middleware for verifying user subscriptions, updating user plans, and deactivating subscriptions. It also ensures premium endpoints are accessed only by paid users.

- **Main Server and Endpoints**

  - Serves endpoints such as:

    - `/topvoice-posts`: Fetches TopVoice posts (available to all users).
    - `/linkedin-posts`: Retrieves LinkedIn posts for Free and premium users after subscription verification.
    - `/keyword-search`: Allows premium keyword searches on LinkedIn posts.

    - `/update-knowledge-base`: Pulls updated LinkedIn posts via a webhook and refreshes the API's internal Knowledge Base (`knowledge_base.json`).
      - `/custom-linkedin-posts`: Serves custom LinkedIn profile posts exclusively for PAID subscribers.
    - Integrates Swagger UI (via `swagger-ui-express`) for API documentation, loaded from the OpenAPI spec in `openapi.json`.

- **API Specification**

  - `openapi.json`: Contains the OpenAPI 3.1.0 specification for endpoints, including authentication, data retrieval, GPT chat, and subscription management.

- **User Data Management**
  - `users.json`: A JSON-based datastore for user information, including subscription and authorization details.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory with the following variables:

   ```env
   # Server Configuration
   PORT=3000
   DOMAIN=<your-domain-url>

   # Gumroad API Configuration
   GUMROAD_APPLICATION_ID=<your-gumroad-app-id>
   GUMROAD_APPLICATION_SECRECT=<your-gumroad-app-secret>
   GUMROAD_ACCESS_TOKEN=<your-gumroad-access-token>
   GUMROAD_REDIRECT_URI=<your-gumroad-redirect-uri>

   # JWT Configuration
   JWT_SECRET=your_jwt_secret

   
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication Endpoints

#### Register a New User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### LinkedIn Data Endpoints

#### Get TopVoice Posts (All Plans)

```http
GET /topvoice-posts
```

#### Get Custom LinkedIn Posts (for FREE or default LinkedIn profile posts)

```http
GET /linkedin-posts?linkedinUrl=https://linkedin.com/in/profile
Authorization: Bearer <jwt_token>
```

#### Keyword Search (Requires Premium PAID Subscription)

```http
GET /keyword-search?keyword=AI
Authorization: Bearer <jwt_token>
```

### GPT Actions Integration

#### Update Knowledge Base

Pulls the latest LinkedIn posts using a webhook response and updates `knowledge_base.json`.

```http
POST /update-knowledge-base
Content-Type: application/json

{
  "linkedinUrl": "https://linkedin.com/in/some-profile"
}
```

Response:

```json
{
  "message": "Knowledge base updated",
  "totalPosts": 100
}
```

#### Custom LinkedIn Posts for Paid Users

Retrieves custom LinkedIn profile posts exclusively for PAID subscribers. If the user isn't subscribed, a checkout URL and instructions are provided.

```http
GET /custom-linkedin-posts?linkedinUrl=https://linkedin.com/in/some-profile&email=user@example.com
```

Response if subscription is active (PAID):

```json
{
  "posts": [...],
  "profile": "https://linkedin.com/in/some-profile",
  "totalPosts": 50
}
```

Response if payment is required:

```json
{
  "error": "This feature requires a Paid subscription. Please complete payment to access custom LinkedIn data.",
  "checkout_url": "<payment link>",
  "instructions": "After payment confirmation, you will be granted access to custom LinkedIn data."
}
```

### Subscription Management

#### View Available Plans

```http
GET /subscription/plans
```

#### Create a New Subscription

```http
POST /subscription/create
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "planType": "PAID"
}
```

## API Specification

The API specification is available in `openapi.json` and can be viewed through the Swagger UI:

```
http://localhost:3000/api-docs
```

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses follow the structure:

```json
{
  "error": "Error message description"
}
```

## Security

- JWT-based authentication for secure access
- Password hashing using bcrypt
- Input validation and sanitization
- Subscription handling with Gumroad (and optionally Stripe)
- Rate limiting (coming soon)

## Data Management

- TopVoice posts are updated daily and stored in `topvoice_posts.json`
- Custom LinkedIn profile data is retained for 24 hours
- Keyword search results are cached in `keyword_posts.json`
- The Knowledge Base for GPT actions is stored in `knowledge_base.json`
- Users are managed via a JSON datastore in `users.json`

## Development & Testing

### Running in Development Mode

```bash
npm run dev
```

### Running Tests

```bash
npm test
```



## Acknowledgments

- n8n webhooks
- OpenAI GPTs
- Gumroad Payment Integration
- Express.js Framework

## Contact

Rahees Ahmed - raheesahmed256@gmail.com
