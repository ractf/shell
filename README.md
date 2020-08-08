# RACTF Shell

![Lint](https://github.com/ractf/shell/workflows/Lint/badge.svg) ![Build](https://github.com/ractf/shell/workflows/Build/badge.svg) ![Build (Production)](https://github.com/ractf/shell/workflows/Build%20(Production)/badge.svg) ![Build (Elite)](https://github.com/ractf/shell/workflows/Build%20(Elite)/badge.svg) ![Build Docker Container](https://github.com/ractf/shell/workflows/Build%20Docker%20Container/badge.svg)

## Installation

`ractf/shell` operates as a static single-page app. This means that you will
require a separate web server to serve files - nginx or apache will usually do
the job. The single dependency for building the app is node.js, this
installation of which widely ranges between distributions. See
[here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for
more details on that.

As this project contains submodules, cloning should be performed with the
command:

```bash
git clone --recursive https://github.com/ractf/shell
```

Before we can build, there are a few settings we need to change. In the
`.env.production` file the `REACT_APP_WSS_URL` variable should be changed to
the websocket location of the backend. This is typically
`wss://[domain]/api/v2/ws`. You may also wish to change `REACT_APP_SENTRY_DSN`
to point to a Sentry DSN. Additionally, if you would like to use Google
Analytics, set the `REACT_APP_GA_UA` variable.

The site will create a copy of itself in players' browsers to allow it to
operate offline and to decrease load times. This is often ideal, however if
you plan to make many frequent edits to the site the experience of "updating"
the web app may not lead to the best user experience. This caching can be
disabled by setting the `ENABLE_SERVICE_WORKER` variable to `false` in
`src/index.js`.

A basic build can now be performed with the following commands:

```bash
cd shell
npm i
npm run build
```

You can now either serve the `./build` directory directly (not recommended) or
copy it's contents into a directory the web server is serving from.
`/var/www/ractf/` is a good choice for this.

It is recommended that you set a very long cache time on the served files, as
there will always be a unique mapping between the URL a file is stored at, and
the content of the file, even when updating or editing the site.
