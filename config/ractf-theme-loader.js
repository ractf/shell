const path = require("path");
const fs = require("fs");

const paths = require("./paths");


const HINT = "/* __INJECTED__ */";

function appendData(absPath, content = "") {
    absPath = absPath.replace(/\\/g, "/");
    const split = absPath.split("/@ractf/ui-kit/");
    if (split.length !== 2) return content;
    if (split[1].indexOf("themes") === 0) return content;

    if (content)
        for (const line of content.split("\n"))
            if (line.indexOf(HINT) === 0)
                return content;

    if (fs.existsSync(paths.themesDir)) {
        let themes = fs.readdirSync(paths.themesDir);
        themes = themes.filter(i => i.indexOf(".") !== 0);
        themes = themes.map(i => [i, path.join(paths.themesDir, i)]);
        themes = themes.filter(i => fs.lstatSync(i[1]).isDirectory());
        for (const theme of themes) {
            const themePath = path.join(theme[1], split[1]);
            if (fs.existsSync(themePath)) {
                const toInject = `${HINT} @import "@ractf/ui-kit/themes/${theme[0]}/${split[1]}";`;
                if (content)
                    return [content, toInject].join("\n");
                return toInject;
            }
        }
    }
    return content;
}

module.exports = {
    appendData,
    default: function (content) {
        return appendData(this.resourcePath, content);
    }
};
