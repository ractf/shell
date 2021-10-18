const path = require("path");
const fs = require("fs");

const paths = require("./paths");


const uiKitTheme = (process.env.RACTF_UI_KIT_THEME || "")
    .split(",")
    .filter(function (x) { return x.length; })
    .map(function (x) { return x.trim(); });

const mergeDictionaries = (object, replacement) => {
    // Merge two dictionaries, keeping keys multiple levels deep.
    Object.keys(replacement).forEach((k) => {
        const replaceWith = replacement[k];
        if (typeof replaceWith === "object") {
            object[k] = mergeDictionaries(object[k], replacement[k]);
        } else {
            object[k] = replacement[k];
        }
    });
    return object;
};

const i18nThemeReplacer = (resourcePath, content) => {
    // Replace entries in the internationalization files with their rethemed entries.
    resourcePath = resourcePath.replace(/\\/g, "/");
    const language = resourcePath.split("/i18n/")[1];

    let languageFile = JSON.parse(content);
    
    if (fs.existsSync(paths.themesDir)) {
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
            const replacementsPath = path.join(theme[1], "i18n", language);
            if (fs.existsSync(replacementsPath)) {
                languageFile = mergeDictionaries(languageFile, require(replacementsPath));
            }
        }
    }

    return JSON.stringify(languageFile);
};

module.exports = {
    default: function (content) {
        return i18nThemeReplacer(this.resourcePath, content);
    }
};
