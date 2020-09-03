import React from "react";

import { _mounts } from "ractf";

export default (mount, props) => {
    const mounts = _mounts[mount];
    if (!mounts) return null;
    return Object.keys(mounts).map(key => {
        if (mounts[key].isComponent)
            return React.createElement(mounts[key].component, { key, mount, ...props });
        else return mounts[key].component(mount, props);
    });
};
