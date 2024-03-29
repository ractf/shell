FROM docker.io/library/node:14.7.0-alpine

WORKDIR /app
RUN apk add git curl

COPY . /app

ENV RACTF_USING_CADDY=true
ENV PNPM_VERSION=6.32.11

RUN curl -L https://unpkg.com/@pnpm/self-installer | node

RUN pnpm install --frozen-lockfile --shamefully-hoist
RUN pnpm run build
RUN cp -r build /site

FROM docker.io/library/caddy:2.1.1-alpine

COPY Caddyfile.development /etc/caddy/Caddyfile.development
COPY Caddyfile.production /etc/caddy/Caddyfile

COPY --from=0 /site /site

EXPOSE 80
