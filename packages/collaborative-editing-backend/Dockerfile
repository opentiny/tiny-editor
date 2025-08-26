FROM node:22-alpine

WORKDIR /app
COPY package.json ./
RUN npm install --no-package-lock && npm install pm2@latest -g
COPY . .

RUN npm run build
CMD [ "pm2-runtime", "start", "ecosystem.config.cjs" ]
