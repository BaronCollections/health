FROM node:20-slim
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-wqy-zenhei \
    fonts-noto-cjk \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app
COPY package.json ./
RUN npm ci --production
COPY src ./src
EXPOSE 3001
CMD ["node", "src/index.js"]
