const path = require("path");
const fs = require("fs");

const paths = require("./paths");


const uiKitTheme = (process.env.RACTF_UI_KIT_THEME || "")
    .split(",")
    .filter(function (x) { return x.length; })
    .map(function (x) { return x.trim(); });

const staticReplacer = (resourcePath, content) => {
    // Replace entries in the static files with their rethemed entries.
    resourcePath = resourcePath.replace(/\\/g, "/");
    const split = resourcePath.split("/static/");

    if (split.length === 2 && fs.existsSync(paths.themesDir)) {
        let themes = fs.readdirSync(paths.themesDir);
        themes = themes.filter(i => {
            if (uiKitTheme.length === 0) {
                return i.indexOf(".") !== 0;
            }
            return uiKitTheme.indexOf(i) !== -1;
        });
        themes = themes.map(i => [i, path.join(paths.themesDir, i)]);
        themes = themes.filter(i => fs.lstatSync(i[1]).isDirectory());
        for (const theme of themes) {
            const replacementPath = path.join(theme[1], "static", split[1]);
            if (fs.existsSync(replacementPath)) {
                return fs.readFileSync(replacementPath);
            }
        }
    }

    return fs.readFileSync(resourcePath);
};

module.exports = {
    default: function (content) {
        return staticReplacer(this.resourcePath, content);
    }
};
