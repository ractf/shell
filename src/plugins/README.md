# Plugins

This is the plugins section of RACTF.

If you fancy expading the project yourself, this is somewhere you might want to
spend a fair amount of time. Currently plugins are used for the following
things:

* Rendering challenge group data into a tab
    * `jeoparady` is the normal mode in most CTFs.
    * `campaign` is an RACTF-special mode that lays out challenges is a grid.
* Rendering challenge dialog boxes
    * `standardChallenge` is a standard `prompt+files+hints -> flag` challenge.

## Hacking

The contents of a plugin can be pretty much anything. In order to setup a
plugin, however, a few things must be done.

First, a `setup.js` file should be created in the root of the plugin. This file
should

```js
import { registerPlugin } from "ractf";
```

then export a single, default, function that calls this function. The arguments
to `registerPlugin` are first the plugin type, then the selector, then the main
export of the plugin. It's easier to just say to look at the default plugins to
get a better idea of what this means.

Secondly, `plugins/index.js` will need updated to pull in your additional
plugin. Although it's possible to dynamically load in plugins, react won't
monitor them for changes that way, which would suck. If you are developing a
plugin for personal use that you don't plan to commit upstream, be careful when
pulling new source from upstream, as this file may encounter merge conflicts.

## I want to access a component that's not exported within a plugin!

Odds are, what you need to do is add an additional export to
`node_modules/ractf.js`. If you wanted access to a site component, odds are
someone else would too, so it'd be appreciated if you can make a merge request
back upstream ;).
