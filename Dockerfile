# Stage 1: Build the React application
FROM node:lts-alpine AS build

WORKDIR /workspace

ARG VITE_TMDB_API_KEY
ENV VITE_TMDB_API_KEY=$VITE_TMDB_API_KEY

COPY package*.json . 
RUN npm install
COPY . .
RUN npm run build

FROM nginx:latest

COPY --from=build /workspace/dist/ /usr/share/nginx/html/
EXPOSE 80
