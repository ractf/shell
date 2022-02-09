FROM node:14.7.0-alpine

WORKDIR /app
RUN apk add git curl

COPY . /app

ENV RACTF_USING_CADDY=true

RUN curl -L https://unpkg.com/@pnpm/self-installer | node

RUN pnpm install --frozen-lockfile
RUN pnpm run build
RUN cp -r build /site

FROM caddy:2.1.1-alpine

COPY Caddyfile.development /etc/caddy/Caddyfile.development
COPY Caddyfile.production /etc/caddy/Caddyfile

COPY --from=0 /site /site

EXPOSE 80
