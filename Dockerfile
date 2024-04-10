FROM node:16.14 as build
WORKDIR /app
COPY . .
RUN set NODE_OPTIONS=--max-old-space-size=4096
RUN npm install
WORKDIR /app/module-federation
RUN npm install
WORKDIR /app
RUN npm run build-federation


FROM nginx:alpine as production
COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
RUN apk add \
    xorg-server \
    libxi-dev \
    libxext-dev
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]