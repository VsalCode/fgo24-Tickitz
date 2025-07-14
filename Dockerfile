FROM node:lts-alpine

WORKDIR /workspace

COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:latest
COPY --from=0 /workspace/dist/ /usr/share/nginx/html/

EXPOSE 80