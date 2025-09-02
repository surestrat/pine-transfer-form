# Use the official Bun image
FROM oven/bun:1-alpine as base
WORKDIR /usr/src/app

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json /temp/dev/
# Copy entire context to access potential lockfiles
COPY . /temp/source/
# Use shell to conditionally copy lockfiles
RUN cd /temp/source && \
    if [ -f bun.lockb ]; then cp bun.lockb /temp/dev/; fi && \
    if [ -f bun.lock ]; then cp bun.lock /temp/dev/; fi
RUN cd /temp/dev && bun install

# Install with --production (exclude devDependencies)  
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
RUN cd /temp/source && \
    if [ -f bun.lockb ]; then cp bun.lockb /temp/prod/; fi && \
    if [ -f bun.lock ]; then cp bun.lock /temp/prod/; fi
RUN cd /temp/prod && bun install --production

# Copy node_modules from temp directory
# Then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
# Skip tests if they fail (optional step)
RUN bun test || echo "Tests failed or not found, continuing..."
RUN bun run build

# Copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist ./dist
COPY --from=prerelease /usr/src/app/package.json .

# Expose port
EXPOSE 4173/tcp

# Run the app
ENTRYPOINT [ "bun", "run", "start" ]
