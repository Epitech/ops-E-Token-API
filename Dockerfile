FROM node:20-alpine

RUN mkdir -p /home/node/app \
    && chown -R node:node /home/node/app \
    && npm install -g pm2 \
    && apk --no-cache -U upgrade
WORKDIR /home/node/app
USER node
COPY --chown=node:node package*.json ./
RUN npm ci --only=production
COPY --chown=node:node . .
CMD pm2-runtime ./process.yml
