FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Monter le code source
VOLUME /app

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
