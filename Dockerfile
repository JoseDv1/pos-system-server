FROM oven/bun:1.1 as base
# Create app directory

WORKDIR /usr/src/app


# --- Install dependencies ---- 
# Install dependencies into temp directory this will cache them and speed up future builds
FROM base as install 
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile 

# Install production dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production


# --- ""Build""" the app --- 
FROM base AS relase
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=install /temp/prod/node_modules node_modules
RUN apt-get update -y && apt-get install -y openssl && apt-get install -y git
COPY . .

# --- Build Steps---

# Set environment variables
ENV DATABASE_URL=postgres://postgres:possystem1001446301!@localhost:5432/pos_system_db
# Generate Prisma client
RUN bunx prisma generate

# --- Run The app ---
USER bun 
# Expose port
EXPOSE 3000
# Start the app
CMD ["bun", "run", "start"]

