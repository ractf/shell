import React from "react";

import { _plugins as plugins } from "@ractf/plugins";


export const getPlugins = (type) => {
    return plugins[type];
};

export const iteratePlugins = (type) => {
    const plugins = getPlugins(type);
    return Object.keys(plugins).map(i => ({ key: i, plugin: plugins[i] }));
};

export const getPlugin = (type, name, fallback) => {
    const plugins = getPlugins(type);
    if (!plugins)
        return null;
    if (plugins[name])
        return plugins[name];
    if (typeof fallback !== "undefined")
        return plugins[fallback] || null;
    return null;
};

export const PluginComponent = ({ type, name, fallback, ...props }) => {
    const plugin = getPlugin(type, name, fallback);
    if (!plugin)
        return (
            <div style={{ color: "#f00" }}>
                Failed to load component {type}/{name}!<br />
                Did you forget to install a plugin?
            </div>
        );
    if (!plugin.component)
        return (
            <div style={{ color: "#f00" }}>
                Plugin {type}/{name} does not provide a component, yet one was requested!<br />
                Was the wrong plugin installed?
            </div>
        );

    if (plugin.rightOf)
        return <PluginComponent type={type} name={plugin.rightOf} rightComponent={plugin.component} {...props} />;
    return React.createElement(plugin.component, { ...props });
};
