# Blog Service

A microservice for managing blog posts and comments in Bailey's Kitchen.

## Features

- CRUD operations for blog posts
- Comment management
- Post and comment likes
- Category-based filtering
- Tag-based search
- Pagination support
- Input validation
- Error handling

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create a .env file with the following variables
DATABASE_URL="postgresql://user:password@localhost:5432/baileys_kitchen_blog"
PORT=3002
NODE_ENV=development
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Generate Prisma client:
```bash
npx prisma generate
```

## Development

Start the development server:
```bash
npm run dev
```

## API Endpoints

### Blog Posts

- `GET /api/blog` - Get all posts (with filters)
- `GET /api/blog/:slug` - Get post by slug
- `POST /api/blog` - Create new post
- `PUT /api/blog/:id` - Update post
- `DELETE /api/blog/:id` - Delete post
- `POST /api/blog/:id/like` - Like post

### Comments

- `GET /api/blog/:postId/comments` - Get comments for a post
- `POST /api/blog/:postId/comments` - Create comment
- `DELETE /api/blog/:postId/comments/:commentId` - Delete comment
- `POST /api/blog/:postId/comments/:commentId/like` - Like comment

## Query Parameters

### Get Posts
- `category` - Filter by category (HEALTH, NUTRITION, etc.)
- `authorId` - Filter by author
- `tag` - Filter by tag
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 50)

## Error Handling

The service returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request 