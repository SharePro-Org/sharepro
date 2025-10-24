# SharePro Frontend - Development Setup

This guide will help you set up the development environment with hot reloading enabled.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd sharepro_app
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env

# Edit .env file with your development settings
# For development, you might want to use:
# NODE_ENV=development
# NEXT_PUBLIC_API_URL=http://localhost:8000/graphql/
```

### 3. Start Development Server with Hot Reloading
```bash
# Option 1: Using the convenience script
./docker.sh dev

# Option 2: Using docker-compose directly
docker-compose -f docker-compose.dev.yml up --build
```

The development server will start at `http://localhost:3000` with hot reloading enabled.

## 🔥 Hot Reloading Features

The development setup includes:
- ✅ **File watching** - Changes to source files trigger automatic rebuilds
- ✅ **Live reload** - Browser automatically refreshes on changes
- ✅ **Fast refresh** - React components update without losing state
- ✅ **Volume mounting** - Source code is mounted for real-time changes
- ✅ **Optimized polling** - File system polling for Docker compatibility

## 📁 Development Architecture

```
sharepro_app/
├── src/                    # Source code (mounted as volume)
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utility libraries
│   └── ...
├── docker-compose.dev.yml # Development container configuration
├── Dockerfile.dev        # Development Docker image
├── docker.sh            # Development convenience script
└── next.config.ts       # Next.js configuration with dev optimizations
```

## 🛠 Available Commands

```bash
# Start development environment
./docker.sh dev

# Stop all services
./docker.sh stop

# View logs
./docker.sh logs frontend

# Clean up Docker resources
./docker.sh cleanup

# Rebuild containers
./docker.sh rebuild

# Help
./docker.sh help
```

## 🔧 Development Configuration

### Environment Variables for Development
```bash
# Essential development variables
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
WATCHPACK_POLLING=true
CHOKIDAR_USEPOLLING=true

# API endpoints (adjust for your setup)
NEXT_PUBLIC_API_URL=http://localhost:8000/graphql/
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws/graphql/
```

### Volume Mounts
- **Source code**: `./src` → `/app/src` (enables hot reloading)
- **Dependencies**: `/app/node_modules` (preserved in container)
- **Build cache**: `/app/.next` (preserved for faster rebuilds)

### File Watching
The setup uses polling-based file watching optimized for Docker:
- Webpack polling: 1000ms intervals
- Chokidar polling: Enabled for cross-platform compatibility
- Watchpack polling: Enabled for Next.js file watching

## 🐛 Troubleshooting

### Hot Reloading Not Working
1. **Check volume mounts**: Ensure `docker-compose.dev.yml` has correct volume mappings
2. **Verify polling**: Check that `WATCHPACK_POLLING=true` is set
3. **Restart container**: `./docker.sh stop && ./docker.sh dev`

### Slow Performance
1. **Exclude large directories**: Add `.git`, `node_modules` to `.dockerignore`
2. **Adjust polling interval**: Increase webpack polling interval in `next.config.ts`
3. **Use bind mounts**: Consider using bind mounts for better performance on some systems

### Permission Issues
1. **File permissions**: The Dockerfile.dev creates a `nextjs` user to avoid permission conflicts
2. **Volume ownership**: Files are owned by `nextjs:nodejs` (1001:1001)

### Build Failures
1. **Node version**: Ensure using Node.js 20+ (required by graphql-ws@6.0.6)
2. **Clear cache**: Run `./docker.sh cleanup && ./docker.sh rebuild`
3. **Check dependencies**: Verify `package.json` and lock files are correct

## 📝 Development Workflow

1. **Start development server**: `./docker.sh dev`
2. **Make code changes**: Edit files in `src/` directory
3. **See changes**: Browser automatically refreshes
4. **Debug**: Use browser dev tools or check container logs
5. **Stop development**: Press `Ctrl+C` or run `./docker.sh stop`

## 🌐 Ports and Services

- **Frontend**: http://localhost:3000
- **Hot reloading**: Automatic (no additional ports needed)
- **Next.js dev server**: Runs inside container with file watching enabled

## 🚀 Ready for Development!

Your development environment is now configured with hot reloading. Any changes you make to the source code will automatically trigger a rebuild and refresh in your browser.

Happy coding! 🎉