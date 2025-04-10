FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

RUN npm run build
FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist /app/dist

EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
