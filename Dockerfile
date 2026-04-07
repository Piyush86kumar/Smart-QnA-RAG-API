FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src/ ./src/
COPY seed.js ./

EXPOSE 3000

CMD ["node", "src/server.js"]
