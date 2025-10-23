# SharePro Frontend - Dokku Deployment Guide

This guide will help you deploy the SharePro Frontend (Next.js) application to your Dokku server.

## Prerequisites

- Dokku server with Node.js buildpack installed
- Git access to the server
- Domain name configured (optional)

## Files Overview

The following files have been added/configured for Dokku deployment:

- `Procfile` - Tells Dokku how to start the application
- `app.json` - Application metadata and configuration
- `.dokkuignore` - Files to exclude from deployment
- `env.example` - Environment variables template
- `deploy.sh` - Automated deployment script
- `src/app/api/health/route.ts` - Health check endpoint

## Quick Deployment

### 1. Server Setup

On your Dokku server, create the application:

```bash
# SSH into your server
ssh root@your-server.com

# Create the Dokku app
dokku apps:create sharepro-frontend

# Set environment variables
dokku config:set sharepro-frontend NODE_ENV=production
dokku config:set sharepro-frontend NEXT_PUBLIC_API_URL=https://api.mysharepro.com/graphql/
dokku config:set sharepro-frontend PORT=3000

# Optional: Configure domain
dokku domains:add sharepro-frontend mysharepro.com
dokku domains:add sharepro-frontend www.mysharepro.com

# Optional: Enable SSL with Let's Encrypt
dokku letsencrypt:enable sharepro-frontend
```

### 2. Deploy from Local Machine

```bash
# Add Dokku as git remote
git remote add dokku dokku@your-server.com:sharepro-frontend

# Deploy
git push dokku main
```

### 3. Alternative: Use the Deploy Script

Make the script executable and run it:

```bash
chmod +x deploy.sh
./deploy.sh
```

## Configuration

### Environment Variables

Set these environment variables on your Dokku server:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `NEXT_PUBLIC_API_URL` | GraphQL API URL | `https://api.mysharepro.com/graphql/` |
| `PORT` | Application port | `3000` |

```bash
dokku config:set sharepro-frontend NODE_ENV=production
dokku config:set sharepro-frontend NEXT_PUBLIC_API_URL=https://api.mysharepro.com/graphql/
```

### Custom Domains

```bash
# Add custom domain
dokku domains:add sharepro-frontend your-domain.com

# Remove default domain (optional)
dokku domains:remove sharepro-frontend sharepro-frontend.your-server.com
```

### SSL Certificate

```bash
# Enable Let's Encrypt SSL
dokku letsencrypt:enable sharepro-frontend

# Auto-renew certificates
dokku letsencrypt:cron-job --add
```

## Monitoring and Maintenance

### View Application Logs

```bash
# View recent logs
dokku logs sharepro-frontend

# Follow logs in real-time
dokku logs sharepro-frontend -t
```

### Application Management

```bash
# Restart application
dokku ps:restart sharepro-frontend

# Check application status
dokku ps:report sharepro-frontend

# Scale application (if needed)
dokku ps:scale sharepro-frontend web=2
```

### Health Check

The application includes a health check endpoint at `/api/health`:

```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "sharepro-frontend",
  "version": "0.1.0",
  "environment": "production",
  "uptime": 3600
}
```

## Troubleshooting

### Build Failures

1. Check Node.js version compatibility:
   ```bash
   dokku config:set sharepro-frontend NODE_VERSION=18.17.0
   ```

2. Clear buildpack cache:
   ```bash
   dokku repo:purge-cache sharepro-frontend
   ```

### Memory Issues

If the application runs out of memory during build:

```bash
# Increase memory limit
dokku config:set sharepro-frontend NODE_OPTIONS="--max-old-space-size=4096"
```

### Port Issues

Ensure the application is listening on the correct port:

```bash
# Check port configuration
dokku config sharepro-frontend | grep PORT
```

### Environment Variable Issues

List all environment variables:

```bash
dokku config sharepro-frontend
```

### DNS Issues

Check domain configuration:

```bash
dokku domains:report sharepro-frontend
```

## Advanced Configuration

### Custom Nginx Configuration

Create a custom nginx configuration:

```bash
# On the server
mkdir -p /home/dokku/sharepro-frontend/nginx.conf.d/
echo 'client_max_body_size 100m;' > /home/dokku/sharepro-frontend/nginx.conf.d/upload.conf
dokku nginx:build-config sharepro-frontend
```

### Database Backup (if applicable)

If your app uses a database:

```bash
# Backup database
dokku postgres:backup sharepro-db backup-$(date +%Y%m%d)

# List backups
dokku postgres:backup-list sharepro-db
```

## Performance Optimization

### Enable Gzip Compression

Nginx compression is enabled by default in Dokku, but you can verify:

```bash
dokku nginx:show-config sharepro-frontend | grep gzip
```

### CDN Integration

For better performance, consider using a CDN for static assets. Update your `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  assetPrefix: process.env.CDN_URL || '',
  // ... other config
};
```

## Security

### Recommended Security Headers

The application should include security headers. These can be configured in `next.config.ts` or via Nginx.

### Regular Updates

Keep dependencies updated:

```bash
npm audit
npm update
```

## Support

For issues specific to this deployment:

1. Check application logs: `dokku logs sharepro-frontend`
2. Verify configuration: `dokku config sharepro-frontend`
3. Test health endpoint: `curl https://your-domain.com/api/health`
4. Check Dokku documentation: [dokku.com](https://dokku.com/)

## Deployment Checklist

- [ ] Dokku server is set up and accessible
- [ ] Application created on Dokku server
- [ ] Environment variables configured
- [ ] Git remote added locally
- [ ] Application successfully deployed
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate enabled
- [ ] Health check endpoint responds correctly
- [ ] Application is accessible via browser