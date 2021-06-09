// Copyright (C) 2021 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

export const cssVar = (name) => (
    getComputedStyle(document.documentElement).getPropertyValue(name)
);

export const transparentize = (colour, alpha) => {
    const [r, g, b] = colourToRGBA(colour);
    return rgb2hex(r, g, b, alpha * 255);
};

export const colourToRGBA = (() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");

    const VAR_RE = /^(?:var\()?(--[a-zA-Z-]+)\)?$/;

    const memoize = (factory, ctx) => {
        var cache = {};
        return key => {
            if (VAR_RE.test(key))
                return factory.call(ctx, key);

            if (!(key in cache))
                cache[key] = factory.call(ctx, key);
            return cache[key];
        };
    };

    return memoize(function (col) {
        if (!col) return [0, 0, 0, 0];

        let var_;
        if ((var_ = VAR_RE.exec(col)))
            col = cssVar(var_[1]);

        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = "#000";
        ctx.fillStyle = col;
        const computed = ctx.fillStyle;
        ctx.fillStyle = "#fff";
        ctx.fillStyle = col;
        if (computed !== ctx.fillStyle)
            return;
        ctx.fillRect(0, 0, 1, 1);
        return [...ctx.getImageData(0, 0, 1, 1).data];
    });
})();

export const hsv2rgb = (h, s, v) => {
    // [0, 1] -> [0, 255]
    // Based on https://stackoverflow.com/a/17243070/6716759
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    let r, g, b;
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        default: break;
    }
    return [r * 255, g * 255, b * 255];
};

export const rgb2hsv = (r, g, b) => {
    // [0, 1] -> [0, 1]
    // Based on https://stackoverflow.com/a/54070620/6716759
    const v = Math.max(r, g, b), c = v - Math.min(r, g, b);
    const h = c && ((v === r) ? (g - b) / c : ((v === g) ? 2 + (b - r) / c : 4 + (r - g) / c));
    return [(h < 0 ? h + 6 : h) / 6, v && c / v, v];
};

export const rgb2hex = (r, g, b, a) => {
    // [0, 255] -> hex
    const part = (i) => {
        i = Math.round(i).toString(16);
        return i.length === 1 ? `0${i}` : i;
    };
    const parts = [part(r), part(g), part(b)];
    // We have a non-default alpha value
    if (a !== 255) parts.push(part(a));
    if (parts.map(i => i[0] === i[1]).reduce((a, b) => a && b))
        // We can use shorthand notation
        return "#" + parts.map(i => i[0]).join("");
    return "#" + parts.join("");
};
