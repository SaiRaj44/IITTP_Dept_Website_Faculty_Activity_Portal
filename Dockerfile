# Use Node.js LTS (Alpine for a smaller image)
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV production

# Copy necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose port
EXPOSE 3000

# Set up for non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create cache directory and set permissions
RUN mkdir -p .next/cache
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Command to run the app
CMD ["node", "server.js"]
