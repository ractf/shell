const path = require('path');

module.exports = {
  stories: [
    "../src/**/*.stories.js",
    "../src/@ractf/ui-kit/components/**/*.stories.js"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async (config, { configType }) => {
    config.resolve.modules = [
      path.resolve(__dirname, "..", "src"),
      "node_modules",
    ];

    config.module.rules.push({
      test: /\.scss$/,
      sideEffects: true,
      exclude: /\.module\.scss$/,
      use: ['style-loader', {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 2
        }
       }, 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });
    config.module.rules.push({
      test: /\.module\.scss$/,
      sideEffects: true,
      use: ['style-loader', {
        loader: require.resolve('css-loader'),
        options: {
          modules: true,
          importLoaders: 2
        }
      }, 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    return config;
  }
};
