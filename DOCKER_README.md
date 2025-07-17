# SharePro Frontend - Docker Setup

This directory contains the Next.js frontend application for SharePro with Docker containerization.

## 🐳 Docker Setup

### Prerequisites

- Docker
- Docker Compose
- Node.js 18+ (for local development)

### Quick Start

#### Development Mode (with hot reloading)

1. **Start the backend services first** (from the reloy directory):
```bash
cd ../reloy
docker-compose -f docker-compose-dev.yml up -d
```

2. **Start the frontend**:
```bash
# Option 1: Using Docker (recommended)
docker-compose -f docker-compose.dev.yml up --build

# Option 2: Local development
yarn install
yarn dev
```

The frontend will be available at `http://localhost:3000`

#### Production Mode

Run the complete stack (frontend + backend):
```bash
docker-compose up --build -d
```

This will start:
- Frontend (Next.js) on `http://localhost:3000`
- Backend API on `http://localhost:8000`
- Database (PostgreSQL) on `http://localhost:5432`
- Redis on `http://localhost:6379`
- Celery workers for background tasks
- Flower for Celery monitoring on `http://localhost:5555`

### 📁 File Structure

```
sharepro/
├── Dockerfile              # Production Dockerfile
├── Dockerfile.dev          # Development Dockerfile
├── docker-compose.yml      # Production compose file
├── docker-compose.dev.yml  # Development compose file
├── .dockerignore           # Docker ignore file
├── .env.local              # Local environment variables
├── .env.production         # Production environment variables
├── next.config.ts          # Next.js configuration
└── package.json            # Dependencies and scripts
```

### 🔧 Configuration

#### Environment Variables

**Development (.env.local)**:
- `NEXT_PUBLIC_GRAPHQL_URL`: GraphQL endpoint URL
- `NEXT_PUBLIC_API_URL`: Backend API base URL

**Production (.env.production)**:
- Same as development but with production URLs
- `NEXTAUTH_SECRET`: Secret for NextAuth.js (if using authentication)
- `NEXTAUTH_URL`: Production domain URL

#### Next.js Configuration

The `next.config.ts` file is configured with:
- `output: 'standalone'` for optimized Docker builds
- Environment variables for GraphQL and API URLs

### 🚀 Development Workflow

1. **Start backend services**:
```bash
cd ../reloy
docker-compose -f docker-compose-dev.yml up -d
```

2. **Start frontend in development mode**:
```bash
# With Docker (hot reloading enabled)
docker-compose -f docker-compose.dev.yml up

# Or locally
yarn dev
```

3. **Access services**:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- GraphQL Playground: `http://localhost:8000/graphql/`

### 🏗️ Building for Production

1. **Build the Docker image**:
```bash
docker build -t sharepro-frontend .
```

2. **Run the production container**:
```bash
docker run -p 3000:3000 sharepro-frontend
```

3. **Or use docker-compose**:
```bash
docker-compose up --build -d
```

### 🔍 Troubleshooting

#### Common Issues

1. **CORS errors**: Ensure the backend CORS settings allow the frontend domain
2. **GraphQL connection issues**: Check that `NEXT_PUBLIC_GRAPHQL_URL` is correct
3. **Build failures**: Clear Docker cache with `docker system prune -a`

#### Useful Commands

```bash
# View logs
docker-compose logs frontend
docker-compose logs api

# Restart services
docker-compose restart frontend

# Clean up
docker-compose down
docker system prune -a

# Enter container
docker-compose exec frontend sh
```

### 📝 Development Notes

- The development Dockerfile uses volume mounting for hot reloading
- Node modules are cached in a Docker volume for faster rebuilds
- The production Dockerfile uses multi-stage builds for optimization
- Environment variables starting with `NEXT_PUBLIC_` are available in the browser

### 🔗 Integration with Backend

This frontend is designed to work with the Django backend in the `../reloy` directory. Make sure to:

1. Start the backend services first
2. Configure the correct GraphQL endpoint URLs
3. Ensure both services are on the same Docker network for communication

### 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Docker Documentation](https://docs.docker.com/)
