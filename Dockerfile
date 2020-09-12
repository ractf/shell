FROM node:14.7.0-alpine

COPY . /app
WORKDIR /app

RUN apk add git

ENV RACTF_USING_CADDY=true

RUN npm i && npm run build
RUN cp -r build /site

FROM caddy:2.1.1-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=0 /site /site

EXPOSE 80
