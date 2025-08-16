FROM node:20-alpine

WORKDIR /app
COPY package.json ./
RUN npm install --no-package-lock
COPY . .

CMD [ "npm", "start" ]
