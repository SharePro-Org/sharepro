#!/bin/bash

# SharePro Frontend Deployment Script for Dokku

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="sharepro-frontend"
DOKKU_SERVER="your-server-ip-or-domain"
DOKKU_USER="dokku"
GIT_REMOTE="dokku"

echo -e "${GREEN}🚀 SharePro Frontend Dokku Deployment Script${NC}"
echo "=============================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command_exists git; then
    echo -e "${RED}❌ Git is not installed${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites met${NC}"

# Build the application locally to check for errors
echo -e "${YELLOW}🔨 Building application locally...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Please fix errors before deploying.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Local build successful${NC}"

# Check if git remote exists
if git remote | grep -q "^${GIT_REMOTE}$"; then
    echo -e "${YELLOW}📡 Git remote '${GIT_REMOTE}' already exists${NC}"
else
    echo -e "${YELLOW}📡 Adding git remote...${NC}"
    read -p "Enter your Dokku server address (e.g., dokku@yourserver.com): " DOKKU_ADDRESS
    git remote add ${GIT_REMOTE} ${DOKKU_ADDRESS}:${APP_NAME}
    echo -e "${GREEN}✅ Git remote added${NC}"
fi

# Deploy to Dokku
echo -e "${YELLOW}🚀 Deploying to Dokku...${NC}"
git add .
git commit -m "Deploy to Dokku - $(date)"

echo -e "${YELLOW}📤 Pushing to Dokku...${NC}"
git push ${GIT_REMOTE} main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo -e "${GREEN}Your app should be available at: http://${APP_NAME}.${DOKKU_SERVER}${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}📚 Useful Dokku commands:${NC}"
echo "View logs: ssh ${DOKKU_USER}@${DOKKU_SERVER} dokku logs ${APP_NAME}"
echo "Restart app: ssh ${DOKKU_USER}@${DOKKU_SERVER} dokku ps:restart ${APP_NAME}"
echo "Check status: ssh ${DOKKU_USER}@${DOKKU_SERVER} dokku ps:report ${APP_NAME}"
echo "Set env var: ssh ${DOKKU_USER}@${DOKKU_SERVER} dokku config:set ${APP_NAME} KEY=value"