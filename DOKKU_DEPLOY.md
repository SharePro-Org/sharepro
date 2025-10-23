# Dokku Configuration

## Environment Variables
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.mysharepro.com/graphql/
PORT=3000

## Build Configuration
# Dokku will automatically detect this as a Node.js app
# and use the npm scripts defined in package.json

## Deployment Commands
# On your server, run these commands:

# 1. Create the app
# dokku apps:create sharepro-frontend

# 2. Set environment variables
# dokku config:set sharepro-frontend NODE_ENV=production
# dokku config:set sharepro-frontend NEXT_PUBLIC_API_URL=https://api.mysharepro.com/graphql/
# dokku config:set sharepro-frontend PORT=3000

# 3. Set domains (optional)
# dokku domains:add sharepro-frontend mysharepro.com
# dokku domains:add sharepro-frontend www.mysharepro.com

# 4. Configure SSL (optional)
# dokku letsencrypt:enable sharepro-frontend

# 5. Deploy from git remote
# git remote add dokku dokku@your-server:sharepro-frontend
# git push dokku main

## Memory and Scale Settings
# dokku ps:scale sharepro-frontend web=1
# dokku config:set sharepro-frontend DOKKU_SCALE=web=1

## Health Checks
# Dokku will automatically check http://your-app/
# Make sure your Next.js app responds to GET requests on /