FROM node:22-alpine

WORKDIR /app
COPY package.json ./
RUN npm install --no-package-lock
COPY . .

RUN npm run build
CMD [ "npx", "pm2-runtime", "start", "ecosystem.config.cjs" ]
