FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 5174

CMD ["npm", "run", "preview", "--", "--port", "5174"]
